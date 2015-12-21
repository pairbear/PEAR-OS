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
            //Creates a file and adds it to the hard drive
            if (this.findFile(fileName) === null) {
                fileNamesList.enqueue(fileName);
                var tsb = this.getNextFileTSB();
                var hexName = TSOS.Utils.stringToHexConverter(fileName);
                var newData = "";
                newData = hexName + new Array(this.dataBits + 1 - hexName.length).join("0");
                sessionStorage.setItem(tsb, '1' + "000" + newData);
                this.setTSB('file');
                if (option) {
                    _StdOut.putText("Creating file " + fileName);
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                }
                TSOS.Control.updateHardDrive();
            }
            else {
                _StdOut.putText("file already exists.");
                _StdOut.advanceLine();
                _StdOut.putText(">");
            }
        };
        DeviceDriverHardDrive.prototype.readFile = function (fileName) {
            //reads the files and outputs them
            var tsb = this.findFile(fileName);
            var contents = "";
            var convertedContents = "";
            var nextTSB = this.getNextTSB(tsb);
            while (nextTSB != "000") {
                if (programChange) {
                    contents += this.getData(nextTSB);
                }
                else {
                    var hexContent = this.getData(nextTSB);
                    hexContent = TSOS.Utils.removeZeroes(hexContent, "0");
                    if (hexContent % 2 !== 0) {
                        hexContent += '0';
                    }
                    debugger;
                    contents += TSOS.Utils.hexToStringConverter(hexContent);
                    globalFileContent = contents;
                }
                nextTSB = this.getNextTSB(nextTSB);
            }
            if (programChange) {
                // if a program is being changed out, grab the contents, and output them globally so they can be used by the hard drive file change out interrupt
                debugger;
                var cleanContent = TSOS.Utils.removeZeroes(contents, "0");
                cleanContent += '0';
                cleanContent = TSOS.Utils.hexToStringConverter(cleanContent);
                cleanContent = cleanContent.replace(/ /g, '');
                var cleanestContent = cleanContent.match(/.{2}/g);
                executingProgramData = cleanestContent;
                this.deleteFile(fileName);
                TSOS.Control.updateHardDrive();
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(HARDDRIVE_FILE_CHANGE_OUT_IRQ, 0));
            }
            else {
                debugger;
                if (this.findFile(fileName) === null) {
                    _StdOut.putText("file does not exist");
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                }
                else {
                    var content = globalFileContent.slice(1, globalFileContent.length - 2);
                    _StdOut.putText("Reading " + fileName + ":");
                    _StdOut.advanceLine();
                    _StdOut.advanceLine();
                    _StdOut.putText(content);
                    _StdOut.advanceLine();
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                }
            }
        };
        DeviceDriverHardDrive.prototype.writeFile = function (fileName) {
            //writes data to a file and if the designated file does not exist, create that file
            if (this.findFile(fileName) === null) {
                if (option) {
                    _StdOut.putText("File does not exist, creating file.");
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                }
                this.createFile(fileName);
            }
            var fileContent = TSOS.Utils.stringToHexConverter(globalFileContent);
            var dataArray = TSOS.Utils.stringSplitter(fileContent, this.dataBits);
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
            if (option) {
                _StdOut.putText("writing to data to " + fileName);
                _StdOut.advanceLine();
                _StdOut.putText(">");
            }
            option = false;
            return true;
        };
        DeviceDriverHardDrive.prototype.deleteFile = function (fileName) {
            //deletes files from the hard drive
            if (this.findFile(fileName) === null) {
                _StdOut.putText("File does not exist");
                _StdOut.advanceLine();
                _StdOut.putText(">");
            }
            else {
                var tsb = this.findFile(fileName);
                var tempTSB1 = tsb;
                var tempTSB2 = tempTSB1;
                while (tempTSB1 !== "000") {
                    tempTSB2 = tempTSB1;
                    tempTSB1 = this.getNextTSB(tempTSB2);
                    var blankBlock = new Array(this.dataBits + this.metaData + 1).join('0');
                    sessionStorage.setItem(tempTSB2, blankBlock);
                }
                if (option) {
                    fileNamesList.removeFile(fileName);
                    _StdOut.putText("Deleting file " + fileName);
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                }
                TSOS.Control.updateHardDrive();
            }
        };
        DeviceDriverHardDrive.prototype.formatFile = function () {
            //wipes and formats the hard drive
            this.init(true);
            //fileNamesList = null;
            TSOS.Control.updateHardDrive();
            return;
        };
        return DeviceDriverHardDrive;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverHardDrive = DeviceDriverHardDrive;
})(TSOS || (TSOS = {}));
