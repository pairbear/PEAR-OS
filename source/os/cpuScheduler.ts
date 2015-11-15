module TSOS {

    export class CPUScheduler {

        constructor (public readyQueue: Queue = new Queue(),
                     public residentQueue: Queue = new Queue(),
                     public cycleCounter :number =0) {

        }

        public loadProgram(pcb) {
            this.residentQueue.enqueue(pcb);
        }


        public runProgram() {
            var currentProgram = this.residentQueue.getPID(executingProgramPID);

            this.readyQueue.enqueue(currentProgram);

            if (!_CPU.isExecuting) {
                executingProgram = this.readyQueue.dequeue();

                executingProgramPID = executingProgram.PID;
            }
            _CPU.updateCPU();
        }

        public runAllPrograms() {
            while(!this.residentQueue.isEmpty()){
                this.readyQueue.enqueue(this.residentQueue.dequeue());
            }
            executingProgram = this.readyQueue.dequeue();
            executingProgramPID = executingProgram.PID;

            _CPU.updateCPU();
        }

        public contextSwitch(){
            if (executingProgram!==null){
                //executingProgram.state = State.ready;
                this.readyQueue.enqueue(executingProgram);
            }
            this.cycleCounter =0;

            executingProgram = this.readyQueue.dequeue();
            executingProgramPID = executingProgram.PID;

            _CPU.updateCPU();
        }

        public killProcess() {
            _CPU.isExecuting = false;
        }

        public ReadyQueueDump() :boolean {
            if (this.readyQueue.getSize()===0){
                this.cycleCounter=0;
            }
            return this.readyQueue.getSize()===0;
        }


    }
}