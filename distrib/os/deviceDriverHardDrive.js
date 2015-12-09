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
            _super.call(this, this.krnHardDriveDriverEntry);
        }
        DeviceDriverHardDrive.prototype.krnHardDriveDriverEntry = function () {
            this.status = "Hard Drive Loaded";
            this.init(false);
        };
        DeviceDriverHardDrive.prototype.init = function (format) {
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
        };
        DeviceDriverHardDrive.prototype.getBlock = function (tsb) {
            return sessionStorage.getItem(tsb);
        };
        DeviceDriverHardDrive.prototype.getMetaData = function (tsb) {
            return this.getBlock(tsb).substring(0, this.metaData);
        };
        DeviceDriverHardDrive.prototype.getDataBytes = function (tsb) {
            return this.getBlock(tsb).substring(this.metaData, this.metaData + this.dataBits);
        };
        return DeviceDriverHardDrive;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverHardDrive = DeviceDriverHardDrive;
})(TSOS || (TSOS = {}));
