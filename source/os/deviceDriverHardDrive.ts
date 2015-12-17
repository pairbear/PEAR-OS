///<reference path="deviceDriver.ts" />

module TSOS {

    export class DeviceDriverHardDrive extends DeviceDriver {

        private tracks:number;
        private sectors:number;
        private blocks:number;
        private metaData:number;
        private dataBits:number;

        constructor() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.metaData = 4;
            this.dataBits = 120;
            super(this.krnHardDriveDriverEntry,
                this.createFile,
                this.readFile,
                this.writeFile,
                this.deleteFile,
                this.formatFile);
        }

        public krnHardDriveDriverEntry() {
            fileNamesList = new Queue();
            this.status = "Hard Drive Loaded";
            this.init(false);
        }

        public init(format:boolean) {
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

        }

        public getFileName(tsb:string) {
            var temp = this.getData(tsb);
            temp = temp.replace(/0+$/g, "");
            if (temp.length % 2 !== 0)
                if (temp === "")
                    return "";
            return TSOS.Utils.hexToStringConverter(temp);
        }

        public getBlock(TSB:string) {
            return sessionStorage.getItem(TSB);
        }

        public getMetaData(TSB:string) {
            var tempTSB = this.getBlock(TSB);
            return tempTSB.substring(0, this.metaData);
        }

        public getData(tsb:string) {
            return this.getBlock(tsb).substring(this.metaData, this.metaData + this.dataBits);
        }

        public getNextFileTSB() {
            return TSOS.Utils.hexToStringConverter(this.getData("000").substring(0, 6));
        }

        public getNextDataTSB() {
            return TSOS.Utils.hexToStringConverter(this.getData("000").substring(6, 12));
        }


        public used(tsb:string):boolean {
            return this.getMetaData(tsb).charAt(0) === '1';
        }

        public setData(tsb:string, blockData:string) {
            sessionStorage.setItem(tsb, this.getMetaData(tsb) + blockData + new Array(this.dataBits - blockData.length + 1).join('0'));
        }

        public setMetaData(tsb:string, metaData:string) {
            if (this.used(tsb)) {
                sessionStorage.setItem(tsb, "1" + metaData + this.getData(tsb));
            }
            else {
                sessionStorage.setItem(tsb, "0" + metaData + this.getData(tsb));
            }
        }

        public setUsedBlock(tsb) {
            sessionStorage.setItem(tsb, "1" + sessionStorage.getItem(tsb).substring(1));
        }


        public getNextTSB(tsb:string) {
            return this.getMetaData(tsb).substring(1, this.metaData);
        }


        public setTSB(type:string) {
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

        }


        public findFile(name:string) {

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
        }


        public createFile(fileName) {
            //Creates a file and adds it to the hard drive
            if (this.findFile(fileName) === null) {
                fileNamesList.enqueue(fileName);
                var tsb:string = this.getNextFileTSB();
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
            } else {
                _StdOut.putText("file already exists.");
                _StdOut.advanceLine();
                _StdOut.putText(">");
            }


        }


        public readFile(fileName:string):any {
            //reads the files and outputs them
                var tsb = this.findFile(fileName);
                var contents = "";
                var convertedContents = "";
                var nextTSB = this.getNextTSB(tsb);
                while (nextTSB != "000") {
                    if (programChange) {
                        contents += this.getData(nextTSB);

                    } else {
                        var hexContent = this.getData(nextTSB);
                        hexContent = Utils.removeZeroes(hexContent, "0");
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
                var cleanContent = Utils.removeZeroes(contents, "0");
                cleanContent += '0';
                cleanContent = Utils.hexToStringConverter(cleanContent);
                cleanContent = cleanContent.replace(/ /g, '');
                var cleanestContent = cleanContent.match(/.{2}/g);
                executingProgramData = cleanestContent;

                this.deleteFile(fileName);

                TSOS.Control.updateHardDrive();

                _KernelInterruptQueue.enqueue(new Interrupt(HARDDRIVE_FILE_CHANGE_OUT_IRQ, 0));
            } else {
                debugger;
                if (this.findFile(fileName) === null) {
                    _StdOut.putText("file does not exist");
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                } else {

                    var content = globalFileContent.slice(1, globalFileContent.length-2);
                    _StdOut.putText("Reading " + fileName + ":");
                    _StdOut.advanceLine();
                    _StdOut.advanceLine();
                    _StdOut.putText(content);
                    _StdOut.advanceLine();
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                }

            }

        }


        public writeFile(fileName:string) {
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
                var dataArray:string[] = TSOS.Utils.stringSplitter(fileContent, this.dataBits);
                var tsbFile:string = this.findFile(fileName);
                var nextTSB:string = this.getNextDataTSB();
                this.setMetaData(tsbFile, nextTSB);
                var prevTSB:string = nextTSB;
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

        }


        public deleteFile(fileName:string) {
            //deletes files from the hard drive

            var tsb = this.findFile(fileName);
            var tempTSB1 = tsb;
            var tempTSB2 = tempTSB1;
            while (tempTSB1 !== "000") {
                tempTSB2 = tempTSB1;
                tempTSB1 = this.getNextTSB(tempTSB2);
                var blankBlock = new Array(this.dataBits + this.metaData + 1).join('0');
                sessionStorage.setItem(tempTSB2, blankBlock);
            }

            TSOS.Control.updateHardDrive();

        }

        public formatFile() {
            //wipes and formats the hard drive
            this.init(true);
            TSOS.Control.updateHardDrive();
            return;
        }


    }

}
