///<reference path="deviceDriver.ts" />

module TSOS {

    export class DeviceDriverHardDrive extends DeviceDriver {

        private tracks:    number;
        private sectors:   number;
        private blocks:    number;
        private metaData:  number;
        private dataBits: number;

        constructor () {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.metaData = 4;
            this.dataBits = 120;
            super(this.krnHardDriveDriverEntry);
        }

        public krnHardDriveDriverEntry() {
            this.status = "Hard Drive Loaded";
            this.init(false);
        }

        public init(format:boolean) {
            if ((sessionStorage.getItem('000') === null && !format) || format) {
                sessionStorage.setItem("000", "1000" + "000000000000" + new Array(120).join('0'));
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
        }

       public getBlock(tsb:string){
            return sessionStorage.getItem(tsb);
        }

        public getMetaData(tsb:string){
            return this.getBlock(tsb).substring(0, this.metaData);
        }

        public getDataBytes(tsb:string){
            return this.getBlock(tsb).substring(this.metaData, this.metaData+this.dataBits);
        }
    }

}
