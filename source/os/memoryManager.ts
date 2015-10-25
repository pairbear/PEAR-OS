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
            var newPCB = new TSOS.ProcessControlBlock();
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

            //return this.memory.userProgram[address];

             if (typeof address==="number"){
                //checking memory in bounds
                if (address>= programs[_ExecutingProgram].limit || address <programs[_ExecutingProgram].base ) {
                    //_KernelInterruptQueue.enqueue(new Interrupt(MEMORY_ACCESS_VIOLATION_IRQ, Utils.dec2hex(address)));
                    alert("something is borked")
                }
                else {
                    return this.memory.userProgram[address];
                }
            }
            else {
                var decAddress = this.convertHex(address);
                //checking memory in bounds
                 // alert(decAddress);
                if (decAddress >= programs[_ExecutingProgram].limit || decAddress < programs[_ExecutingProgram].base) {
                    //_KernelInterruptQueue.enqueue(new Interrupt(MEMORY_ACCESS_VIOLATION_IRQ, address));
                    alert("something else is borked");
                }
                else {
                    return this.memory.userProgram[decAddress];
                }
            }
        }


        public convertHex(data):number {
            return parseInt(data, 16);
        }

        public getNext2Bytes(beginningAddress) {
            return this.getMemory(this.getMemory(beginningAddress + 1) + this.getMemory(beginningAddress));
        }

        public getDecFromHex(beginningAddress) {
            return this.convertHex(this.getMemory(beginningAddress + 1) + this.getMemory(beginningAddress));
        }

        public storeInMemory(beginningAddress, value) {
            var hexValue = value.toString(16).toUpperCase();
            hexValue = Array(2 - (hexValue.length - 1)).join("0") + hexValue;
            var position = this.getDecFromHex(beginningAddress);
            this.memory.userProgram[position] = hexValue;

        }


    }
}

