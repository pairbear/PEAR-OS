/* ------------
 Queue.ts

 A simple Queue, which is really just a dressed-up JavaScript Array.
 See the Javascript Array documentation at
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 Look at the push and shift methods, as they are the least obvious here.

 ------------ */

module TSOS {
    export class Queue {
        constructor(public q = new Array(),
                    private lastPCB: number = null) {
        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty() {
            return (this.q.length == 0);
        }

        public enqueue(element) {
            this.q.push(element);
        }

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }

        public getPID(pid) {
            var retVal = null;
            for (var i = 0; i < this.q.length; i++) {
                if (this.q[i].PID === pid) {
                    retVal = this.q[i];
                    if (i > -1)
                        this.q.splice(i, 1);
                    return retVal;
                }
            }
        }

        public getPCB(i) {
            return this.q[i];
        }

        public setPriorityOrder() {
            for (var i = 0; i < this.q.length; i++) {
                this.q.sort(this.comparePriorityOrder);
            }
        }

        public comparePriorityOrder(a,b) {
            if (a.Priority < b.Priority)
                return -1;
            if (a.Priority > b.Priority)
                return 1;
            return 0;
        }


        public addLastProcess(pcb) {
            this.q.splice(this.lastPCB, 0, pcb);
            this.lastPCB = null;
        }

        public getLastProcess(){
            var retVal =null;
            for (var i =0; i<this.q.length; i++){
                    if (this.q[i].location === Locations.memory){
                        retVal = this.q[i];
                        this.lastPCB =i;
                }
            }
            this.q.splice(this.lastPCB, 1);
            return retVal;
        }

        public removeFile(file){

            var retVal = null;
                for (var i =0; i<this.q.length; i++){
                    if (this.q[i] === file){
                        retVal = this.q[i];
                        if (i>-1)
                            this.q.splice(i, 1);
                        return retVal;
                    }
                }
            return retVal;
        }

    }
}
