module TSOS {

export class processControlBlock {
    constructor (
        public PID: number = 0,
        public Priority: number = 0,
        public Counter: number = 0,
        public PC: number = 0,
        public Acc: number = 0,
        public Xreg: number = 0,
        public Yreg: number = 0,
        public Zflag: number = 0,

        public base: number = 0,
        public limit: number = 0

) {
        this.PID = currentPID;
        currentPID++;
    }
}

}
