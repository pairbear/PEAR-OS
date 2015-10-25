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
            this.updateCPU();
            TSOS.Control.updateAssemblerCode();
        }

        public updateCPU(){
            if (this.isExecuting) {
                programs[_ExecutingProgram].PC = this.PC;
                programs[_ExecutingProgram].Instruction = this.Instruction;
                programs[_ExecutingProgram].Acc = this.Acc;
                programs[_ExecutingProgram].Xreg = this.Xreg;
                programs[_ExecutingProgram].Yreg = this.Yreg;
                programs[_ExecutingProgram].Zflag = this.Zflag;
            }
        }

        /*public runProgram() {
            this.cycle()
                var PCB = new TSOS.ProcessControlBlock();
                PCB.PC = this.PC;
                PCB.Acc = this.Acc;
                PCB.Xreg = this.Xreg;
                PCB.Yreg = this.Yreg;
                PCB.Zflag = this.Zflag;

        }*/

        public execute(instructions):void {

            this.Instruction = instructions.toUpperCase();

            switch (this.Instruction) {

                case "A9" :{
                    //Loads the accumulator with a constant
                    this.Acc = memoryManager.convertHex(memoryManager.getMemory(++this.PC));
                    assemblerCode = "LDA #$" + memoryManager.getMemory(this.PC);
                    break;
                }
                case "AD" :{
                    //loads the accumulator from memory
                    this.Acc = memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC));
                    assemblerCode = "LDA $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "8D" :{
                    memoryManager.storeInMemory(++this.PC, this.Acc);
                    assemblerCode = "STA $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "6D" :{
                    //Adds with Carry: Adds contents of an address to the contents
                    // of the accumulator and keeps the result in the accumulator
                    memoryManager.storeInMemory(++this.PC, this.Acc);
                    assemblerCode = "ADC $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "A2" :{
                    //Loads the X register with a constant
                    this.Xreg = memoryManager.convertHex(memoryManager.getMemory(++this.PC));
                    assemblerCode = "LDX #$" + memoryManager.getMemory(this.PC);
                    break;

                }
                case "AE" :{
                    //Loads the X register from memory
                    this.Xreg = memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC));
                    assemblerCode = "LDX $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "A0" :{
                    //Loads the Y register with a constant
                    this.Yreg = memoryManager.convertHex(memoryManager.getMemory(++this.PC));
                    assemblerCode = "LDY #$" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "AC" :{
                    //Loads the Y register from memory
                    this.Yreg = memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC));
                    assemblerCode = "LDY $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "EA" :{
                    //No operation
                    assemblerCode = "NOP";
                    break;
                }
                case "00" :{
                    //Break
                    this.updateCPU();
                    assemblerCode = "BRK";
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
                    assemblerCode = "CPX $" + memoryManager.getNext2Bytes(this.PC);
                    this.PC++;
                    break;
                }
                case "D0" :{
                    //Branch N bytes if Z flag = 0
                    if (this.Zflag == 0) {
                        assemblerCode = "BNE $" + memoryManager.getMemory(this.PC + 1);
                        this.PC += memoryManager.convertHex(memoryManager.getMemory(++this.PC)) + 1;
                        if (this.PC>=256) {
                            this.PC -= 256;
                        }
                    } else {
                        assemblerCode = "BNE $" + memoryManager.getMemory(this.PC);
                        this.PC++;
                    }
                    break;


                }
                case "EE" :{
                    //Increment the value of a byte
                    memoryManager.storeInMemory(this.PC +1, (memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC)) +1));
                    assemblerCode = "INC $" + memoryManager.getNext2Bytes(this.PC);
                    this.PC++;
                    break;

                }
                case "FF" :{
                    //System Call
                    assemblerCode = "SYS";
                    _KernelInterruptQueue.enqueue(new Interrupt(CPU_SYS_IRQ, 3));
                    break;
                }
                default :{
                    //fucking chicken strips...
                        break;
                    }

            } this.PC++;
        }




    }
}