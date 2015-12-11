module TSOS {

    export class MemoryManager {

        constructor(public memory:Memory = new Memory(memorySize),
                    public nextOpenMemoryBlock: number = 0) {
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

        public findNextOpenBlock() {
            for (var i =0; i< 256 * programNumbers; i+=256){
                if (this.memory.userProgram[i]==="00")
                    return i;
            }
            return null;
    }


        public loadProgram(program, priority) {
            var newPCB = new TSOS.ProcessControlBlock();
            newPCB.base = this.nextOpenMemoryBlock;
            newPCB.PC = newPCB.base;
            newPCB.limit = newPCB.base + 256;
            newPCB.Priority = priority;
            scheduler.loadProgram(newPCB);
            for (var i = 0; i < program.length; i++) {
                this.memory.userProgram[i + newPCB.base] = program[i];
            }
            this.nextOpenMemoryBlock = this.findNextOpenBlock();
            this.updateMemoryDisplay();
            return (newPCB.PID).toString()
        }

        public getMemory(address:any) {
             if (typeof address==="number"){
                    return this.memory.userProgram[address];
            }
            else {
                var decAddress = this.convertHex(address) + executingProgram.base;
                    return this.memory.userProgram[decAddress];
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
            var position = this.getDecFromHex(beginningAddress) + executingProgram.base;
            this.memory.userProgram[position] = hexValue;

        }


    }
}

