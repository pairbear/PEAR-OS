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
        CPUScheduler.prototype.loadProgram = function (pcb) {
            this.residentQueue.enqueue(pcb);
        };
        CPUScheduler.prototype.runProgram = function () {
            var currentProgram = this.residentQueue.getPID(executingProgramPID);
            //executingProgram.state = State.ready;
            this.readyQueue.enqueue(currentProgram);
            if (!_CPU.isExecuting) {
                executingProgram = this.readyQueue.dequeue();
                executingProgramPID = executingProgram.PID;
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
            if (executingProgram !== null) {
                executingProgram.state = State.ready;
                this.readyQueue.enqueue(executingProgram);
            }
            this.cycleCounter = 0;
            executingProgram = this.readyQueue.dequeue();
            executingProgramPID = executingProgram.PID;
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
