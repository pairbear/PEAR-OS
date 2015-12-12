var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(readyQueue, residentQueue, cycleCounter) {
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            if (residentQueue === void 0) { residentQueue = new TSOS.Queue(); }
            if (cycleCounter === void 0) { cycleCounter = 0; }
            this.readyQueue = readyQueue;
            this.residentQueue = residentQueue;
            this.cycleCounter = cycleCounter;
        }
        CPUScheduler.prototype.loadProgramToMemory = function (program, priority) {
            var newPCB = new TSOS.ProcessControlBlock();
            newPCB.location = Locations.memory;
            newPCB.base = memoryManager.nextOpenMemoryBlock;
            newPCB.PC = newPCB.base;
            newPCB.limit = newPCB.base + 256;
            newPCB.Priority = priority;
            this.residentQueue.enqueue(newPCB);
            for (var i = 0; i < program.length; i++) {
                memoryManager.memory.userProgram[i + newPCB.base] = program[i];
            }
            memoryManager.nextOpenMemoryBlock = memoryManager.findNextOpenBlock();
            memoryManager.updateMemoryDisplay();
            return (newPCB.PID).toString();
        };
        CPUScheduler.prototype.loadProgramToHardDrive = function (program, priority) {
            var newPCB = new TSOS.ProcessControlBlock();
            newPCB.location = Locations.hardDrive;
            newPCB.base = null;
            newPCB.PC = 0;
            newPCB.limit = null;
            newPCB.Priority = priority;
            this.residentQueue.enqueue(newPCB);
            memoryManager.nextOpenMemoryBlock = memoryManager.findNextOpenBlock();
            memoryManager.updateMemoryDisplay();
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_IRQ, "tempProgram"));
            return (newPCB.PID).toString();
        };
        CPUScheduler.prototype.runProgram = function () {
            var currentProgram = this.residentQueue.getPID(executingProgramPID);
            //executingProgram.state = State.ready;
            this.readyQueue.enqueue(currentProgram);
            if (!_CPU.isExecuting) {
                if (currentProgram.location === Locations.memory) {
                    executingProgram = this.readyQueue.dequeue();
                    executingProgramPID = executingProgram.PID;
                }
                else {
                    executingProgram = null;
                    this.contextSwitch();
                }
            }
            _CPU.updateCPU();
        };
        CPUScheduler.prototype.runAllPrograms = function () {
            while (!this.residentQueue.isEmpty()) {
                this.readyQueue.enqueue(this.residentQueue.dequeue());
                if (scheduleType == "priority") {
                    this.readyQueue.setPriorityOrder();
                }
            }
            executingProgram = this.readyQueue.dequeue();
            executingProgramPID = executingProgram.PID;
            _CPU.updateCPU();
        };
        CPUScheduler.prototype.contextSwitch = function () {
            executingProgram = this.readyQueue.dequeue();
            executingProgramPID = executingProgram.PID;
            if (executingProgram !== null) {
                executingProgram.state = State.ready;
                this.readyQueue.enqueue(executingProgram);
            }
            this.cycleCounter = 0;
            if (executingProgram.location === Locations.hardDrive) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(READ_IRQ, "tempProgram"));
                if (memoryManager.nextOpenMemoryBlock !== null) {
                    executingProgram.base = memoryManager.nextOpenMemoryBlock;
                    executingProgram.limit = executingProgram.base + 255;
                }
                else {
                    var lastPCB = this.residentQueue.dequeue();
                    var useReady = lastPCB === null;
                    if (useReady)
                        lastPCB = this.readyQueue.dequeue();
                    var lastProgram = [];
                    lastProgram = memoryManager.getProgram(lastPCB);
                    globalFileContent = lastProgram.join('');
                    executingProgram.base = lastPCB.base;
                    executingProgram.limit = lastPCB.limit;
                    lastPCB.location = Locations.hardDrive;
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_IRQ, "tempProgram"));
                    if (useReady) {
                        this.readyQueue.enqueue(lastPCB);
                    }
                    else {
                        this.residentQueue.enqueue(lastPCB);
                    }
                }
            }
            _CPU.updateCPU();
        };
        CPUScheduler.prototype.killProcess = function (PID) {
            var currProgram = null;
            if (executingProgramPID === PID) {
                executingProgramPID = null;
                executingProgram = null;
            }
            else {
                currProgram = this.readyQueue.getPID(PID);
            }
        };
        CPUScheduler.prototype.ReadyQueueDump = function () {
            if (this.readyQueue.getSize() === 0) {
                this.cycleCounter = 0;
            }
            return this.readyQueue.getSize() === 0;
        };
        CPUScheduler.prototype.schedulerType = function (type) {
            if (type == "rr") {
                quantum = 6;
            }
            else if (type == "fcfs") {
                quantum = 1000;
            }
            else if (type == "priority") {
                quantum = 1000;
            }
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
