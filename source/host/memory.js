var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(byte) {
            this.byte = byte;
            this.byte = byte;
            this.userProgram = new Array(byte);
            this.init();
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < this.byte; i++) {
                this.userProgram[i] = "00";
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map