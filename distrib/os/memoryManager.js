var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(memory, nextOpenMemoryBlock) {
            if (memory === void 0) { memory = new TSOS.Memory(memorySize); }
            if (nextOpenMemoryBlock === void 0) { nextOpenMemoryBlock = 0; }
            this.memory = memory;
            this.nextOpenMemoryBlock = nextOpenMemoryBlock;
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
        MemoryManager.prototype.findNextOpenBlock = function () {
            for (var i = 0; i < 256 * programNumbers; i += 256) {
                if (this.memory.userProgram[i] === "00")
                    return i;
            }
            return null;
        };
        // TODO: delete this?
        MemoryManager.prototype.setNextOpenBlock = function (pcb) {
            this.nextOpenMemoryBlock = pcb.base;
        };
        MemoryManager.prototype.loadProgram = function (program, priority) {
            var newPCB = new TSOS.ProcessControlBlock();
            newPCB.base = this.nextOpenMemoryBlock;
            newPCB.PC = newPCB.base;
            newPCB.limit = newPCB.base + 256;
            newPCB.Priority = priority;
            scheduler.loadProgram(newPCB);
            for (var i = 0; i < program.length; i++) {
                this.memory.userProgram[i + newPCB.base] = program[i];
            }
            this.nextOpenMemoryBlock = this.findNextOpenBlock();
            this.updateMemoryDisplay();
            return (newPCB.PID).toString();
        };
        MemoryManager.prototype.getMemory = function (address) {
            if (typeof address === "number") {
                return this.memory.userProgram[address];
            }
            else {
                var decAddress = this.convertHex(address) + executingProgram.base;
                return this.memory.userProgram[decAddress];
            }
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
            var position = this.getDecFromHex(beginningAddress) + executingProgram.base;
            this.memory.userProgram[position] = hexValue;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
