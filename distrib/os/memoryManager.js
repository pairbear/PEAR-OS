var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(memory, locations) {
            if (memory === void 0) { memory = new TSOS.Memory(memorySize); }
            if (locations === void 0) { locations = new Array(programNumbers); }
            this.memory = memory;
            this.locations = locations;
        }
        MemoryManager.prototype.loadProgram = function (program) {
            alert("Test");
            var newPCB = new TSOS.processControlBlock();
            newPCB.base = 0;
            newPCB.limit = newPCB.base + programSize;
            programs[newPCB.PID] = newPCB;
            for (var i = 0; i < program.length; i++) {
                this.memory.userProgram[i] = program[i];
            }
            return (newPCB.PID).toString();
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
