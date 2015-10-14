module TSOS {

    export class Memory {
        public userProgram: Array<string>;
        constructor (public byte:number) {
            this.byte = byte;
            this.userProgram = new Array(byte);
            this.init();
        }

        public init(): void {
            for (var i = 0; i< this.byte; i++){
            this.userProgram[i] = "00"
        }
        }

    }
}
