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
            for (var i=0; i <programNumbers; i++){
                var emptyBlock=true;
                var base = 255*i;
                for (var j =0; j< 256; j++){
                    if (this.memory.userProgram[base+j]!=="00"){
                        emptyBlock=false;
                        break;
                    }
                }
                if (emptyBlock)
                    return i * (256);
            }
            return null;
    }


        public loadProgram(currPCB, program){
            currPCB.location = Locations.memory;
            for (var i=0; i<program.length; i++){
                this.memory.userProgram[i+currPCB.base] = program[i];
            }

            for (var j= program.length+currPCB.base;j<currPCB.limit; j++ )
                this.memory.userProgram[j] ="00";

            this.nextOpenMemoryBlock = this.findNextOpenBlock();
            this.updateMemoryDisplay();
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

        public getProgram(pcb){

            var program = [];
            for (var i=pcb.base; i<=pcb.limit; i++){
                program.push(this.memory.userProgram[i]);
            }
            return program;
        }

        public clearProgram() {
            for (var i = executingProgram.base; i<executingProgram.limit; i++){
                this.memory.userProgram[i] = "00";
            }
            this.nextOpenMemoryBlock = this.findNextOpenBlock();
            this.updateMemoryDisplay();
        }


    }
}

