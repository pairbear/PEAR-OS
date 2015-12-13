module TSOS {

    export class CPUScheduler {

        constructor (public readyQueue: Queue = new Queue(),
                     public residentQueue: Queue = new Queue(),
                     public cycleCounter :number =0) {

        }


        public loadProgramToMemory(program, priority) {
            //loads a program to memory
            //debugger;
            var newPCB = new TSOS.ProcessControlBlock();
            newPCB.location = Locations.memory;
            newPCB.base = memoryManager.nextOpenMemoryBlock;
            newPCB.PC = 0;
            newPCB.limit = newPCB.base + 256;
            if (typeof priority !== "undefined") {
                newPCB.Priority = priority;
            }
            this.residentQueue.enqueue(newPCB);
            for (var i = 0; i < program.length; i++) {
                memoryManager.memory.userProgram[i + newPCB.base] = program[i];
            }
            memoryManager.nextOpenMemoryBlock = memoryManager.findNextOpenBlock();
            memoryManager.loadProgram(newPCB, program);
            memoryManager.updateMemoryDisplay();
            return (newPCB.PID).toString()
        }

        public loadProgramToHardDrive(program, priority) {
            //loads a program to the hard drive
            var newPCB = new TSOS.ProcessControlBlock();
            newPCB.location = Locations.hardDrive;
            newPCB.base = null;
            newPCB.PC = 0
            newPCB.limit = null;
            if (typeof priority !== "undefined") {
                newPCB.Priority = priority;
            }
            this.residentQueue.enqueue(newPCB);

            memoryManager.nextOpenMemoryBlock = memoryManager.findNextOpenBlock();
            memoryManager.updateMemoryDisplay();
            _KernelInterruptQueue.enqueue(new Interrupt(WRITE_IRQ, "tempProgram"));
            return (newPCB.PID).toString()
        }


        public runProgram() {
            //runs a designated process
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
            //runs all programs
            //debugger;
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
            //switches executing program
            //debugger;
            if (executingProgram!==null){
                executingProgram.state = State.ready;
                this.readyQueue.enqueue(executingProgram);
            }

            this.cycleCounter =0;
            executingProgram = this.readyQueue.dequeue();
            executingProgramPID = executingProgram.PID;

            //debugger;

            if (executingProgram.location === Locations.hardDrive) {
                //used to exchange files between memory and the hard drive
                programChange = true;
                 _KernelInterruptQueue.enqueue(new Interrupt(READ_IRQ, "tempProgram"))
                if (memoryManager.nextOpenMemoryBlock !== null) {
                    executingProgram.base = memoryManager.nextOpenMemoryBlock;
                    executingProgram.limit = executingProgram.base + 255;

                } else {
                    //debugger;
                    var lastPCB = this.residentQueue.getLastProcess();
                    var useReady=lastPCB===null;
                    if (useReady)
                        lastPCB = this.readyQueue.getLastProcess();
                    var lastProgram=[];
                    lastProgram = memoryManager.getProgram(lastPCB);
                    lastProgram = lastProgram.slice(0, 256);
                    globalFileContent =lastProgram.join('');
                    executingProgram.base = lastPCB.base;
                    executingProgram.limit = lastPCB.limit;
                    lastPCB.location =Locations.hardDrive;
                    _KernelInterruptQueue.enqueue(new Interrupt(WRITE_IRQ, "tempProgram"));
                    if (useReady) {
                        this.readyQueue.addLastProcess(lastPCB);
                    } else {
                        this.residentQueue.addLastProcess(lastPCB);
                    }
                }
            } else {
                _CPU.updateCPU();
            }
        }

        public killProcess(PID) {
            // kills a running process
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
            // changes the schedule type
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