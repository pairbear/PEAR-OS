module TSOS {

    export class MemoryManager {

        constructor(public memory:Memory =new Memory(memorySize),
                    public locations: Array<Number> = new Array(programNumbers)) {}

        public loadProgram(program) {
            alert("Test");
            var newPCB =  new TSOS.processControlBlock();
            newPCB.base = 0;
            newPCB.limit = newPCB.base + programSize;

            programs[newPCB.PID] = newPCB;

            for (var i=0; i<program.length; i++){
                this.memory.userProgram[i] = program[i];
            }

            return (newPCB.PID).toString()


    }



}
}