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
            /*for (var i =0; i< 256 * programNumbers; i+=256){
                if (this.memory.userProgram[i]==="00")
                    return i;
            }
            return null; */
            for (var i = 0; i < programNumbers; i++) {
                var blockEmpty = true;
                var base = 255 * i;
                for (var j = 0; j < 256; j++) {
                    if (this.memory.userProgram[base + j] !== "00") {
                        blockEmpty = false;
                        break;
                    }
                }
                if (blockEmpty)
                    return i * (256);
            }
            return null;
        };
        MemoryManager.prototype.loadProgram = function (currPCB, program) {
            currPCB.location = Locations.memory;
            for (var i = 0; i < program.length; i++) {
                this.memory.userProgram[i + currPCB.base] = program[i];
            }
            for (var j = program.length + currPCB.base; j < currPCB.limit; j++)
                this.memory.userProgram[j] = "00";
            this.nextOpenMemoryBlock = this.findNextOpenBlock();
            this.updateMemoryDisplay();
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
        MemoryManager.prototype.getProgram = function (pcb) {
            var program = [];
            for (var i = pcb.base; i <= pcb.limit; i++) {
                program.push(this.memory.userProgram[i]);
            }
            return program;
        };
        MemoryManager.prototype.clearProgram = function () {
            for (var i = executingProgram.base; i < executingProgram.limit; i++) {
                this.memory.userProgram[i] = "00";
            }
            this.nextOpenMemoryBlock = this.findNextOpenBlock();
            this.updateMemoryDisplay();
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
