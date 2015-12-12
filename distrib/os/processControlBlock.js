var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(PID, Priority, PC, Acc, Xreg, Yreg, Zflag, base, limit, state, location) {
            if (PID === void 0) { PID = 0; }
            if (Priority === void 0) { Priority = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            if (state === void 0) { state = State.new; }
            if (location === void 0) { location = Locations.memory; }
            this.PID = PID;
            this.Priority = Priority;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
            this.state = state;
            this.location = location;
            this.PID = currentPID;
            currentPID++;
        }
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
