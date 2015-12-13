/* ------------
 Queue.ts

 A simple Queue, which is really just a dressed-up JavaScript Array.
 See the Javascript Array documentation at
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 Look at the push and shift methods, as they are the least obvious here.

 ------------ */
var TSOS;
(function (TSOS) {
    var Queue = (function () {
        function Queue(q, lastPCB) {
            if (q === void 0) { q = new Array(); }
            if (lastPCB === void 0) { lastPCB = null; }
            this.q = q;
            this.lastPCB = lastPCB;
        }
        Queue.prototype.getSize = function () {
            return this.q.length;
        };
        Queue.prototype.isEmpty = function () {
            return (this.q.length == 0);
        };
        Queue.prototype.enqueue = function (element) {
            this.q.push(element);
        };
        Queue.prototype.dequeue = function () {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        };
        Queue.prototype.toString = function () {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        };
        Queue.prototype.getPID = function (pid) {
            var retVal = null;
            for (var i = 0; i < this.q.length; i++) {
                if (this.q[i].PID === pid) {
                    retVal = this.q[i];
                    if (i > -1)
                        this.q.splice(i, 1);
                    return retVal;
                }
            }
        };
        Queue.prototype.getPCB = function (i) {
            return this.q[i];
        };
        Queue.prototype.setPriorityOrder = function () {
            this.q.sort();
        };
        Queue.prototype.addLastProcess = function (pcb) {
            this.q.splice(this.lastPCB, 0, pcb);
            this.lastPCB = null;
        };
        Queue.prototype.getLastProcess = function () {
            var retVal = null;
            for (var i = 0; i < this.q.length; i++) {
                if (this.q[i].location === Locations.memory) {
                    retVal = this.q[i];
                    this.lastPCB = i;
                }
            }
            this.q.splice(this.lastPCB, 1);
            return retVal;
        };
        return Queue;
    })();
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
