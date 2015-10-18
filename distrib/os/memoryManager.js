var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(memory) {
            if (memory === void 0) { memory = new TSOS.Memory(memorySize); }
            this.memory = memory;
        }
        MemoryManager.prototype.init = function () {
            this.updateMemoryDisplay();
        };
        MemoryManager.prototype.updateMemoryDisplay = function () {
            var output = "<tr>";
            for (var i = 0; i < this.memory.byte; i++) {
                if (i % 8 === 0) {
                    output += "</tr><tr><td> <b>" + TSOS.Utils.createHexIndex(i) + " </td>";
                }
                output += "<td>" + this.memory.userProgram[i] + '</td>';
            }
            output += "</tr>";
            TSOS.Control.updateMemoryDisplay(output);
        };
        MemoryManager.prototype.loadProgram = function (program) {
            var newPCB = new TSOS.ProcessControlBlock();
            newPCB.base = 0;
            newPCB.limit = newPCB.base + programSize;
            programs[newPCB.PID] = newPCB;
            for (var i = 0; i < program.length; i++) {
                this.memory.userProgram[i] = program[i];
            }
            this.updateMemoryDisplay();
            return (newPCB.PID).toString();
        };
        MemoryManager.prototype.getMemory = function (address) {
            return this.memory.userProgram[address];
        };
        MemoryManager.prototype.convertHex = function (data) {
            return parseInt(data, 16);
        };
        MemoryManager.prototype.getNext2Bytes = function (beginningAddress) {
            return this.getMemory(this.getMemory(beginningAddress + 1) + this.getMemory(beginningAddress));
        };
        MemoryManager.prototype.getDecFromHex = function (beginningAddress) {
            return this.convertHex(this.getMemory(beginningAddress + 1) + this.getMemory(beginningAddress));
        };
        MemoryManager.prototype.storeInMemory = function (beginningAddress, value) {
            var hexValue = value.toString(16).toUpperCase();
            hexValue = Array(2 - (hexValue.length - 1)).join("0") + hexValue;
            var position = this.getDecFromHex(beginningAddress);
            this.memory.userProgram[position] = hexValue;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
