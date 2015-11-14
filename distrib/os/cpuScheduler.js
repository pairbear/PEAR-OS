var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(readyQueue, residentQueue, counter) {
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            if (residentQueue === void 0) { residentQueue = new TSOS.Queue(); }
            if (counter === void 0) { counter = 0; }
            this.readyQueue = readyQueue;
            this.residentQueue = residentQueue;
            this.counter = counter;
        }
        CPUScheduler.prototype.loadProgram = function (pcb) {
            this.residentQueue.enqueue(pcb);
        };
        CPUScheduler.prototype.runProgram = function () {
            var currentProgram = this.residentQueue.find(executingProgramPID);
            this.readyQueue.enqueue(currentProgram);
            if (!_CPU.isExecuting) {
                executingProgram = this.residentQueue.dequeue();
                executingProgramPID = executingProgram.PID;
            }
            _CPU.updateCPU();
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
