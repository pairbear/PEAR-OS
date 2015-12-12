module TSOS {

    export class CPUScheduler {

        constructor (public readyQueue: Queue = new Queue(),
                     public residentQueue: Queue = new Queue(),
                     public cycleCounter :number =0) {

        }


        public loadProgramToMemory(program, priority) {
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
            return (newPCB.PID).toString()
        }

        public loadProgramToHardDrive(program, priority) {
            var newPCB = new TSOS.ProcessControlBlock();
            newPCB.location = Locations.hardDrive;
            newPCB.base = null;
            newPCB.PC = 0
            newPCB.limit = null;
            newPCB.Priority = priority;
            this.residentQueue.enqueue(newPCB);

            memoryManager.nextOpenMemoryBlock = memoryManager.findNextOpenBlock();
            memoryManager.updateMemoryDisplay();
            _KernelInterruptQueue.enqueue(new Interrupt(WRITE_IRQ, "tempProgram"));
            return (newPCB.PID).toString()
        }


        public runProgram() {
            var currentProgram = this.residentQueue.getPID(executingProgramPID);
            //executingProgram.state = State.ready;

            this.readyQueue.enqueue(currentProgram);

            if (!_CPU.isExecuting) {
                if (currentProgram.location === Locations.memory) {
                    executingProgram = this.readyQueue.dequeue();
                    executingProgramPID = executingProgram.PID;
                } else {
                    executingProgram = null
                    this.contextSwitch();
                }
            }
            _CPU.updateCPU();
        }

        public runAllPrograms() {

            while(!this.residentQueue.isEmpty()){
                this.readyQueue.enqueue(this.residentQueue.dequeue());

                if (scheduleType == "priority" ) {
                    this.readyQueue.setPriorityOrder();
                }
            }
            executingProgram = this.readyQueue.dequeue();
            executingProgramPID = executingProgram.PID;

            _CPU.updateCPU();
        }

        public contextSwitch(){

            executingProgram = this.readyQueue.dequeue();
            executingProgramPID = executingProgram.PID;

            if (executingProgram!==null){
                executingProgram.state = State.ready;
                this.readyQueue.enqueue(executingProgram);
            }
            this.cycleCounter =0;

            if (executingProgram.location === Locations.hardDrive) {
                 _KernelInterruptQueue.enqueue(new Interrupt(READ_IRQ, "tempProgram"))
                if (memoryManager.nextOpenMemoryBlock !== null) {
                    executingProgram.base = memoryManager.nextOpenMemoryBlock;
                    executingProgram.limit = executingProgram.base + 255;

                } else {
                    var lastPCB = this.residentQueue.dequeue();
                    var useReady=lastPCB===null;
                    if (useReady)
                        lastPCB = this.readyQueue.dequeue();
                    var lastProgram=[];
                    lastProgram = memoryManager.getProgram(lastPCB);
                    globalFileContent =lastProgram.join('');
                    executingProgram.base = lastPCB.base;
                    executingProgram.limit = lastPCB.limit;
                    lastPCB.location =Locations.hardDrive;
                    _KernelInterruptQueue.enqueue(new Interrupt(WRITE_IRQ, "tempProgram"));
                    if (useReady) {
                        this.readyQueue.enqueue(lastPCB);
                    } else {
                        this.residentQueue.enqueue(lastPCB);
                    }
                }
            }

            _CPU.updateCPU();
        }

        public killProcess(PID) {
            var currProgram = null;
            if (executingProgramPID === PID) {
                executingProgramPID = null;
                executingProgram = null;

            } else {
                    currProgram = this.readyQueue.getPID(PID);
                }
            }


        public ReadyQueueDump() :boolean {
            if (this.readyQueue.getSize()===0){
                this.cycleCounter=0;
            }
            return this.readyQueue.getSize()===0;
        }

        public schedulerType(type) {
            if (type == "rr") {
                quantum = 6;
            } else if (type == "fcfs") {
                quantum = 1000;

            } else if (type == "priority") {
                quantum = 1000;

            }
        }


    }
}