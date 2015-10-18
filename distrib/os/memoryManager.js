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
            var newPCB = new TSOS.processControlBlock();
            newPCB.base = 0;
            newPCB.limit = newPCB.base + programSize;
            programs[newPCB.PID] = newPCB;
            alert(this.memory.userProgram);
            for (var i = 0; i < program.length; i++) {
                this.memory.userProgram[i] = program[i];
            }
            alert(this.memory.userProgram);
            this.updateMemoryDisplay();
            return (newPCB.PID).toString();
        };
        MemoryManager.prototype.getMemory = function (address) {
            alert("is this even set off?");
            return this.memory.userProgram[address];
        };
        MemoryManager.prototype.convertHexData = function (data) {
            var retvalue = _OsShell.G_UserProgram;
            return parseInt(retvalue, 16);
        };
        MemoryManager.prototype.getNextTwoDataBytes = function (startAddress) {
            return this.getMemory(this.getMemory(startAddress + 1) + this.getMemory(startAddress));
        };
        MemoryManager.prototype.getDecAddressFromHex = function (startAddress) {
            return this.convertHexData(this.getMemory(startAddress + 1) + this.getMemory(startAddress));
        };
        MemoryManager.prototype.storeInMemory = function (startAddress, value) {
            //debugger;
            var valueHex = value.toString(16).toUpperCase();
            valueHex = Array(2 - (valueHex.length - 1)).join("0") + valueHex;
            var position = this.getDecAddressFromHex(startAddress);
            //check if memory is in bounds
            if (position >= programs[executingProgram].limit || position < programs[executingProgram].base)
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(memoryViolationIRQ, startAddress));
            else
                this.memory.userProgram[position] = valueHex;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
