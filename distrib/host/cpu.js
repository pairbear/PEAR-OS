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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, Instruction, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (Instruction === void 0) { Instruction = ""; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.Instruction = Instruction;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.execute(memoryManager.getMemory(this.PC));
            this.updateCPU();
            TSOS.Control.updateAssemblerCode();
        };
        Cpu.prototype.updateCPU = function () {
            if (this.isExecuting) {
                programs[_ExecutingProgram].PC = this.PC;
                programs[_ExecutingProgram].Instruction = this.Instruction;
                programs[_ExecutingProgram].Acc = this.Acc;
                programs[_ExecutingProgram].Xreg = this.Xreg;
                programs[_ExecutingProgram].Yreg = this.Yreg;
                programs[_ExecutingProgram].Zflag = this.Zflag;
            }
        };
        /*public runProgram() {
            this.cycle()
                var PCB = new TSOS.ProcessControlBlock();
                PCB.PC = this.PC;
                PCB.Acc = this.Acc;
                PCB.Xreg = this.Xreg;
                PCB.Yreg = this.Yreg;
                PCB.Zflag = this.Zflag;

        }*/
        Cpu.prototype.execute = function (instructions) {
            this.Instruction = instructions.toUpperCase();
            switch (this.Instruction) {
                case "A9": {
                    //Loads the accumulator with a constant
                    this.Acc = memoryManager.convertHex(memoryManager.getMemory(++this.PC));
                    assemblerCode = "LDA #$" + memoryManager.getMemory(this.PC);
                    break;
                }
                case "AD": {
                    //loads the accumulator from memory
                    this.Acc = memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC));
                    assemblerCode = "LDA $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "8D": {
                    memoryManager.storeInMemory(++this.PC, this.Acc);
                    assemblerCode = "STA $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "6D": {
                    //Adds with Carry: Adds contents of an address to the contents
                    // of the accumulator and keeps the result in the accumulator
                    memoryManager.storeInMemory(++this.PC, this.Acc);
                    assemblerCode = "ADC $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "A2": {
                    //Loads the X register with a constant
                    this.Xreg = memoryManager.convertHex(memoryManager.getMemory(++this.PC));
                    assemblerCode = "LDX #$" + memoryManager.getMemory(this.PC);
                    break;
                }
                case "AE": {
                    //Loads the X register from memory
                    this.Xreg = memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC));
                    assemblerCode = "LDX $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "A0": {
                    //Loads the Y register with a constant
                    this.Yreg = memoryManager.convertHex(memoryManager.getMemory(++this.PC));
                    assemblerCode = "LDY #$" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "AC": {
                    //Loads the Y register from memory
                    this.Yreg = memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC));
                    assemblerCode = "LDY $" + memoryManager.getMemory(this.PC);
                    this.PC++;
                    break;
                }
                case "EA": {
                    //No operation
                    assemblerCode = "NOP";
                    break;
                }
                case "00": {
                    //Break
                    this.updateCPU();
                    assemblerCode = "BRK";
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_BRK_IRQ, 2));
                    break;
                }
                case "EC": {
                    //Compares a byte in memory to the the X register
                    //Sets the Z (zero) flag if equal
                    alert("EC");
                    if ((memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC)) == this.Xreg)) {
                        this.Zflag = 1;
                    }
                    else {
                        this.Zflag = 0;
                    }
                    assemblerCode = "CPX $" + memoryManager.getNext2Bytes(this.PC);
                    this.PC++;
                    break;
                }
                case "D0": {
                    //Branch N bytes if Z flag = 0
                    if (this.Zflag == 0) {
                        assemblerCode = "BNE $" + memoryManager.getMemory(this.PC + 1);
                        this.PC += memoryManager.convertHex(memoryManager.getMemory(++this.PC)) + 1;
                    }
                    else {
                        assemblerCode = "BNE $" + memoryManager.getMemory(this.PC);
                    }
                    this.PC++;
                    break;
                }
                case "EE": {
                    //Increment the value of a byte
                    alert("EE" + memoryManager.getNext2Bytes(++this.PC));
                    alert("EE 2" + memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC)) + 1);
                    memoryManager.storeInMemory(this.PC + 1, (memoryManager.convertHex(memoryManager.getNext2Bytes(++this.PC)) + 1));
                    assemblerCode = "INC $" + memoryManager.getNext2Bytes(this.PC);
                    this.PC++;
                    break;
                }
                case "FF": {
                    //System Call
                    assemblerCode = "SYS";
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_SYS_IRQ, 3));
                    break;
                }
                default: {
                    //fuck your chicken strips...
                    alert("default");
                    break;
                }
            }
            this.PC++;
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
