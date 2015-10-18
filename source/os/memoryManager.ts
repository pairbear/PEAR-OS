module TSOS {

    export class MemoryManager {

        constructor(public memory:Memory = new Memory(memorySize)) {
        }

        public init():void {
            this.updateMemoryDisplay();
        }

        public updateMemoryDisplay() {
            var output = "<tr>";
            for (var i = 0; i < this.memory.byte; i++) {

                if (i % 8 === 0) {
                    output += "</tr><tr><td> <b>" + Utils.createHexIndex(i) + " </td>";
                }
                output += "<td>" + this.memory.userProgram[i] +  '</td>';
            }
            output += "</tr>";
            Control.updateMemoryDisplay(output);

        }


        public loadProgram(program) {
            var newPCB = new TSOS.processControlBlock();
            newPCB.base = 0;
            newPCB.limit = newPCB.base + programSize;
            programs[newPCB.PID] = newPCB;
            for (var i = 0; i < program.length; i++) {
                this.memory.userProgram[i] = program[i];
            }
            this.updateMemoryDisplay();
            return (newPCB.PID).toString()
        }

        public getMemory(address:any) {
            return this.memory.userProgram[address];
        }

        public convertHex(data):number {
            //var retvalue = _OsShell.G_UserProgram;
            return parseInt(data, 16);
        }

        public getNext2Bytes(startAddress) {
            return this.getMemory(this.getMemory(startAddress + 1) + this.getMemory(startAddress));
        }

        public getDecFromHex(startAddress) {
            return this.convertHex(this.getMemory(startAddress + 1) + this.getMemory(startAddress));
        }

        public storeInMemory(startAddress, value) {
            //debugger;
            var valueHex = value.toString(16).toUpperCase();
            valueHex = Array(2 - (valueHex.length - 1)).join("0") + valueHex;
            var position = this.getDecFromHex(startAddress);
            //check if memory is in bounds
            if (position >= programs[executingProgram].limit || position < programs[executingProgram].base)
                _KernelInterruptQueue.enqueue(new Interrupt(memoryViolationIRQ, startAddress));
            else
                this.memory.userProgram[position] = valueHex;

        }


    }
}

