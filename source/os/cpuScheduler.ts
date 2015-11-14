module TSOS {

    export class CPUScheduler {

        constructor (public readyQueue: Queue = new Queue(),
                     public residentQueue: Queue = new Queue(),
                     public counter :number =0) {

        }

        public loadProgram(pcb) {
            this.residentQueue.enqueue(pcb);
        }


        public runProgram() {
            var currentProgram = this.residentQueue.getPID(executingProgramPID);
            this.readyQueue.enqueue(currentProgram);

            if (!_CPU.isExecuting) {
                executingProgram = this.residentQueue.dequeue();
                executingProgramPID = executingProgram.PID;
            }
            _CPU.updateCPU();
        }


    }
}