module TSOS {

export class ProcessControlBlock {
    constructor (
        public PID: number = 0,
        public Priority: number = 0,
        public PC: number = 0,
        public Acc: number = 0,
        public Xreg: number = 0,
        public Yreg: number = 0,
        public Zflag: number = 0,
        public base: number = 0,
        public limit: number = 0,
        public state: State =State.new,
        public location: Locations = Locations.memory

) {
        this.PID = currentPID;
        currentPID++;
    }
}

}
