///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public Instruction: string = "",
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.execute(memoryManager.getMemory(this.PC));
            alert(executingProgram.PC)
            this.updatePCB();
            TSOS.Control.updateAssemblerCode();
            TSOS.Control.updateCPUDisplay();
            TSOS.Control.updatePCBDisplay();
        }

        public updateCPU(){
            if (this.isExecuting) {
                this.PC = executingProgram.PC
                this.Instruction = executingProgram.Instruction;
                this.Acc = executingProgram.Acc;
                this.Xreg = executingProgram.Xreg;
                this.Yreg = executingProgram.Yreg;
                this.Zflag = executingProgram.Zflag;


                /*executingProgram.PC = this.PC;
                executingProgram.Instruction = this.Instruction;
                executingProgram.Acc = this.Acc;
                executingProgram.Xreg = this.Xreg;
                executingProgram.Yreg = this.Yreg;
                executingProgram.Zflag = this.Zflag;

                programs[executingProgram].PC = this.PC;
                programs[executingProgram].Instruction = this.Instruction;
                programs[executingProgram].Acc = this.Acc;
                programs[executingProgram].Xreg = this.Xreg;
                programs[executingProgram].Yreg = this.Yreg;
                programs[executingProgram].Zflag = this.Zflag; */
            }
        }

        public updatePCB() {
            //update program pcb
            alert("A")
            alert(executingProgram.PC)
            alert("AA")
            executingProgram.PC = _CPU.PC;
            alert("B")
            executingProgram.Instruction = _CPU.Instruction;
            alert("C")
            executingProgram.Acc = _CPU.Acc;
            alert("D")
            executingProgram.Xreg = _CPU.Xreg;
            executingProgram.Yreg = _CPU.Yreg;
            executingProgram.Zflag = _CPU.Zflag;
        }

        public execute(instructions):void {

            this.Instruction = instructions.toUpperCase();
            //alert(this.Instruction);
            switch (this.Instruction) {

                case "A9" :{
                    //Loads the accumulator with a constant
                    this.Acc = memoryManager.convertHex(memoryManager.getMemory(++this.PC));
                    assemblerCode = "A9 LDA #$" + memoryManager.getMemory(this.PC);
                    break;
                }
                case "AD" :{
                    //loads the accumulator from memory
                    this.Acc = memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC));
                    assemblerCode = "AD LDA $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;

                }
                case "8D" :{
                    //store the accumulator in memory
                    memoryManager.storeInMemory(++this.PC, this.Acc);
                    assemblerCode = "8D STA $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;

                }
                case "6D" :{
                    //Adds with Carry: Adds contents of an address to the contents
                    // of the accumulator and keeps the result in the accumulator
                    this.Acc += memoryManager.convertHex( memoryManager.getNext2Bytes(++this.PC));
                    assemblerCode = "6D ADC $" + memoryManager.getNext2Bytes(this.PC);
                    this.PC++;
                    break;
                }
                case "A2" :{
                    //Loads the X register with a constant
                    this.Xreg = memoryManager.convertHex(memoryManager.getMemory(++this.PC));
                    assemblerCode = "A2 LDX #$" + memoryManager.getMemory(this.PC);
                    break;

                }
                case "AE" :{
                    //Loads the X register from memory
                    this.Xreg = memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC));
                    //alert("xreg = " + this.Xreg);
                    assemblerCode = "AE LDX $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "A0" :{
                    //Loads the Y register with a constant
                    this.Yreg = memoryManager.convertHex(memoryManager.getMemory(++this.PC));
                    assemblerCode = "A0 LDY #$" + memoryManager.getMemory(this.PC);
                    break;
                }
                case "AC" :{
                    //Loads the Y register from memory
                    this.Yreg = memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC));
                    assemblerCode = "AC LDY $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "EA" :{
                    //No operation
                    assemblerCode = "EA NOP";
                    break;
                }
                case "00" :{
                    //Break
                    this.updatePCB();
                    assemblerCode = "00 BRK";
                    _KernelInterruptQueue.enqueue(new Interrupt(CPU_BRK_IRQ, 2));
                    break;
                }
                case "EC" :{
                    //Compares a byte in memory to the the X register
                    //Sets the Z (zero) flag if equal
                    if ((memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC)) == this.Xreg)) {
                        this.Zflag = 1
                    } else {
                        this.Zflag = 0
                    }
                    assemblerCode = "EC CPX $" + memoryManager.getNext2Bytes(this.PC);
                    this.PC++;
                    break;
                }
                case "D0" :{
                    //Branch N bytes if Z flag = 0
                    if (this.Zflag == 0) {
                        assemblerCode = "D0 BNE $" + memoryManager.getMemory(this.PC + 1);
                        this.PC += memoryManager.convertHex(memoryManager.getMemory(++this.PC)) + 1;
                        //alert(this.PC)
                        if (this.PC>= 256) {
                            this.PC -= 256;
                        }
                    } else {
                        assemblerCode = "D0 BNE $" + memoryManager.getMemory(this.PC);
                        this.PC++;
                    }
                    break;

                }
                case "EE" :{
                    //Increment the value of a byte
                    memoryManager.storeInMemory(this.PC +1, (memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC)) +1));
                    assemblerCode = "EE INC $" + memoryManager.getNext2Bytes(this.PC);
                    this.PC++;
                    break;

                }
                case "FF" :{
                    //System Call
                    assemblerCode = "FF SYS";
                    _KernelInterruptQueue.enqueue(new Interrupt(CPU_SYS_IRQ, 3));
                    break;
                }
                default :{
                    //fucking chicken strips...
                    alert("this better not have happened... or Alan or anyone that uses this will not be happy");
                        break;
                    }

            } this.PC++;
        }




    }
}