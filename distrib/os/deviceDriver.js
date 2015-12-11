/* ------------------------------
     DeviceDriver.ts

     The "base class" for all Device Drivers.
     ------------------------------ */
var TSOS;
(function (TSOS) {
    var DeviceDriver = (function () {
        function DeviceDriver(driverEntry, isr, isr1, isr2, isr3, isr4, isr5) {
            if (driverEntry === void 0) { driverEntry = null; }
            if (isr === void 0) { isr = null; }
            if (isr1 === void 0) { isr1 = null; }
            if (isr2 === void 0) { isr2 = null; }
            if (isr3 === void 0) { isr3 = null; }
            if (isr4 === void 0) { isr4 = null; }
            if (isr5 === void 0) { isr5 = null; }
            this.driverEntry = driverEntry;
            this.isr = isr;
            this.isr1 = isr1;
            this.isr2 = isr2;
            this.isr3 = isr3;
            this.isr4 = isr4;
            this.isr5 = isr5;
            this.version = '0.07';
            this.status = 'unloaded';
            this.preemptable = false;
        }
        return DeviceDriver;
    })();
    TSOS.DeviceDriver = DeviceDriver;
})(TSOS || (TSOS = {}));
