module TSOS {

    export class cpuScheduler {

        constructor (public readyQueue: Queue = new Queue(),
                     public residentQueue: Queue = new Queue(),
                     public counter :number =0) {

        }

        public runProgram(){

        }

    }
}