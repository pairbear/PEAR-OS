///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSOS;
(function (TSOS) {
    var DeviceDriverHardDrive = (function (_super) {
        __extends(DeviceDriverHardDrive, _super);
        function DeviceDriverHardDrive() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.metaData = 4;
            this.dataBits = 120;
            _super.call(this, this.krnHardDriveDriverEntry, this.createFile, this.readFile, this.writeFile, this.deleteFile, this.formatFile);
        }
        DeviceDriverHardDrive.prototype.krnHardDriveDriverEntry = function () {
            fileNamesList = new TSOS.Queue();
            this.status = "Hard Drive Loaded";
            this.init(false);
        };
        DeviceDriverHardDrive.prototype.init = function (format) {
            sessionStorage.setItem("000", "1000" + "303031313030" + new Array(120).join('0'));
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        if ("" + t + "" + s + "" + b !== "000") {
                            var emptyBlock = new Array(this.dataBits + this.metaData + 1).join('0');
                            sessionStorage.setItem(t + "" + s + "" + b, emptyBlock);
                        }
                    }
                }
            }
            return true;
        };
        DeviceDriverHardDrive.prototype.getFileName = function (tsb) {
            var temp = this.getData(tsb);
            temp = temp.replace(/0+$/g, "");
            if (temp.length % 2 !== 0)
                temp += '0';
            if (temp === "")
                return "";
            return TSOS.Utils.hexToStringConverter(temp);
        };
        DeviceDriverHardDrive.prototype.getBlock = function (TSB) {
            return sessionStorage.getItem(TSB);
        };
        DeviceDriverHardDrive.prototype.getMetaData = function (TSB) {
            var tempTSB = this.getBlock(TSB);
            return tempTSB.substring(0, this.metaData);
        };
        DeviceDriverHardDrive.prototype.getData = function (tsb) {
            return this.getBlock(tsb).substring(this.metaData, this.metaData + this.dataBits);
        };
        DeviceDriverHardDrive.prototype.getNextFileTSB = function () {
            return TSOS.Utils.hexToStringConverter(this.getData("000").substring(0, 6));
        };
        DeviceDriverHardDrive.prototype.getNextDataTSB = function () {
            return TSOS.Utils.hexToStringConverter(this.getData("000").substring(6, 12));
        };
        DeviceDriverHardDrive.prototype.used = function (tsb) {
            return this.getMetaData(tsb).charAt(0) === '1';
        };
        DeviceDriverHardDrive.prototype.setData = function (tsb, blockData) {
            sessionStorage.setItem(tsb, this.getMetaData(tsb) + blockData + new Array(this.dataBits - blockData.length + 1).join('0'));
        };
        DeviceDriverHardDrive.prototype.setMetaData = function (tsb, metaData) {
            if (this.used(tsb)) {
                sessionStorage.setItem(tsb, "1" + metaData + this.getData(tsb));
            }
            else {
                sessionStorage.setItem(tsb, "0" + metaData + this.getData(tsb));
            }
        };
        DeviceDriverHardDrive.prototype.setUsedBlock = function (tsb) {
            sessionStorage.setItem(tsb, "1" + sessionStorage.getItem(tsb).substring(1));
        };
        DeviceDriverHardDrive.prototype.getNextTSB = function (tsb) {
            return this.getMetaData(tsb).substring(1, this.metaData);
        };
        DeviceDriverHardDrive.prototype.setTSB = function (type) {
            if (type === "file") {
                var tmax = 0;
                var smax = 7;
                var bmax = 7;
                var tmin = 0;
                var smin = 0;
                var bmin = 0;
            }
            else if (type === "data") {
                var tmax = 3;
                var smax = 7;
                var bmax = 7;
                var tmin = 1;
                var smin = 0;
                var bmin = 0;
            }
            for (var t = tmin; t < tmax + 1; t++) {
                for (var s = smin; s < smax + 1; s++) {
                    for (var b = bmin; b < bmax + 1; b++) {
                        if ("" + t + "" + s + "" + b !== "000") {
                            if (!this.used(t + "" + s + "" + b)) {
                                var newMBR = this.getData('000');
                                var newTSB = TSOS.Utils.stringToHexConverter(t + "" + s + "" + b);
                                if (type === 'file') {
                                    newMBR = newTSB + newMBR.substring(6);
                                }
                                else if (type === 'data') {
                                    newMBR = newMBR.substring(0, 6) + newTSB + newMBR.substring(12);
                                }
                                sessionStorage.setItem("000", this.getMetaData('000') + newMBR);
                                return;
                            }
                        }
                    }
                }
            }
            var newMBR = this.getData('000');
            var newTSB = TSOS.Utils.stringToHexConverter('000');
            if (type === 'file') {
                newMBR = newTSB + newMBR.substring(6);
            }
            else if (type === 'data') {
                newMBR = newMBR.substring(0, 6) + newTSB + newMBR.substring(12);
            }
            sessionStorage.setItem("000", this.getMetaData('000') + newMBR);
        };
        DeviceDriverHardDrive.prototype.findFile = function (name) {
            for (var t = 0; t <= 0; t++) {
                for (var s = 0; s <= 7; s++) {
                    for (var b = 0; b <= 7; b++) {
                        if (t + "" + s + "" + b !== "000") {
                            var tempData = this.getFileName(t + "" + s + "" + b);
                            if (tempData === name) {
                                return t + "" + s + "" + b;
                            }
                        }
                    }
                }
            }
            return null;
        };
        DeviceDriverHardDrive.prototype.createFile = function (fileName) {
            if (this.findFile(fileName) === null) {
                success = true;
                var tsb = this.getNextFileTSB();
                var hexName = TSOS.Utils.stringToHexConverter(fileName);
                var newData = "";
                newData = hexName + new Array(this.dataBits + 1 - hexName.length).join("0");
                sessionStorage.setItem(tsb, '1' + "000" + newData);
                this.setTSB('file');
                TSOS.Control.updateHardDrive();
            }
            else {
                success = false;
            }
        };
        DeviceDriverHardDrive.prototype.readFile = function (fileName) {
            //debugger;
            var tsb = this.findFile(fileName);
            var contents = "";
            var convertedContents = "";
            var nextTSB = this.getNextTSB(tsb);
            while (nextTSB != "000") {
                if (programChange) {
                    contents += this.getData(nextTSB);
                }
                else {
                    var hexContents = this.getData(nextTSB);
                    if (hexContents % 2 !== 0) {
                        hexContents += '0';
                    }
                    contents += TSOS.Utils.hexToStringConverter(hexContents);
                }
                nextTSB = this.getNextTSB(nextTSB);
            }
            convertedContents += TSOS.Utils.hexToStringConverter(contents);
            globalFileContent = convertedContents;
            if (programChange) {
                //debugger;
                var cleanContent = TSOS.Utils.removeUnwantedSymbols(convertedContents);
                var cleanestContent = cleanContent.match(/.{2}/g);
                cleanestContent.slice(0, 256);
                debugger;
                executingProgramData = cleanestContent;
                this.deleteFile(fileName);
                TSOS.Control.updateHardDrive();
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(HARDDRIVE_FILE_CHANGE_OUT_IRQ, 0));
            }
            return;
        };
        DeviceDriverHardDrive.prototype.writeFile = function (fileName) {
            if (this.findFile(fileName) === null) {
                this.createFile(fileName);
            }
            var fileContent = TSOS.Utils.stringToHexConverter(globalFileContent);
            var dataArray = TSOS.Utils.stringsplitter(fileContent, this.dataBits);
            var tsbFile = this.findFile(fileName);
            var nextTSB = this.getNextDataTSB();
            this.setMetaData(tsbFile, nextTSB);
            var prevTSB = nextTSB;
            for (var i = 0; i < dataArray.length; i++) {
                prevTSB = nextTSB;
                this.setUsedBlock(prevTSB);
                this.setTSB('data');
                var nextTSB = this.getNextDataTSB();
                this.setMetaData(prevTSB, nextTSB);
                this.setData(prevTSB, dataArray[i]);
            }
            this.setMetaData(prevTSB, "000");
            TSOS.Control.updateHardDrive();
            return true;
        };
        DeviceDriverHardDrive.prototype.deleteFile = function (fileName) {
            var tsb = this.findFile(fileName);
            var tempTSB1 = tsb;
            var tempTSB2 = tempTSB1;
            while (tempTSB1 !== "000") {
                tempTSB2 = tempTSB1;
                tempTSB1 = this.getNextTSB(tempTSB2);
                //this.eraseBlock(tempTSB2);
                var blankBlock = new Array(this.dataBits + this.metaData + 1).join('0');
                sessionStorage.setItem(tempTSB2, blankBlock);
            }
            TSOS.Control.updateHardDrive();
        };
        DeviceDriverHardDrive.prototype.formatFile = function () {
            this.init(true);
            TSOS.Control.updateHardDrive();
            return;
        };
        return DeviceDriverHardDrive;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverHardDrive = DeviceDriverHardDrive;
})(TSOS || (TSOS = {}));
