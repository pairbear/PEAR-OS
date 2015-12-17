///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSOS;
(function (TSOS) {
    var DeviceDriverFileSystem = (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem() {
            _super.apply(this, arguments);
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.metaData = 4;
            this.dataBits = 120;
        }
        DeviceDriverFileSystem.prototype.init = function (format) {
            if ((sessionStorage.getItem('000') === null && !format) || format) {
                debugger;
                //set the master boot record
                //first 3 spots of data is next available file name
                //next 3 spots are for the next available datablock
                var hexDefaultMBR = "303031313030";
                sessionStorage.setItem("000", "1000" + hexDefaultMBR + new Array(120 - hexDefaultMBR.length + 1).join('0'));
                for (var t = 0; t < this.tracks; t++) {
                    for (var s = 0; s < this.sectors; s++) {
                        for (var b = 0; b < this.blocks; b++) {
                            if ("" + t + "" + s + "" + b !== "000") {
                                //TODO Find out if swap files should be deleted on format
                                try {
                                    // ;
                                    var blankBlock = new Array(this.dataBits + this.metaData + 1).join('0');
                                    sessionStorage.setItem(t + "" + s + "" + b, blankBlock);
                                }
                                catch (e) {
                                    alert('Quota exceeded!');
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
            }
        };
        return DeviceDriverFileSystem;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
