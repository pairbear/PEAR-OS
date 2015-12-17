///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />

/* ------------
 Control.ts

 Requires globals.ts.

 Routines for the hardware simulation, NOT for our client OS itself.
 These are static because we are never going to instantiate them, because they represent the hardware.
 In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
 is the "bare metal" (so to speak) for which we write code that hosts our client OS.
 But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
 in both the host and client environments.

 This (and other host/simulation scripts) is the only place that we should see "web" code, such as
 DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

 This code references page numbers in the text book:
 Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
 ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit():void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value = "";

            //Adds things to the status bar
            Time = <HTMLDivElement>document.getElementById('time');
            Status = <HTMLDivElement>document.getElementById('status');


            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg:string, source:string = "?"):void {
            // Note the OS CLOCK.
            var clock:number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now:number = new Date().getTime();
            var date = new Date();
            Time.textContent = "Time : " + date.toLocaleDateString() + " " + date.toLocaleTimeString();

            // Build the log string.
            var str:string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn):void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            // initiates the memory manger
            memoryManager = new MemoryManager();
            memoryManager.init();

            // initiates the CPU Scheduler
            scheduler = new CPUScheduler();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.

            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.

            //initiates the filesystem
            TSOS.Control.updateHardDrive();


        }

        public static hostBtnHaltOS_click(btn):void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn):void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
        /*
        public static Program1_click(): void
        {
            document.getElementById("taProgramInput").innerHTML = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00";
        }

        public static Program2_click(): void
        {
            document.getElementById("taProgramInput").innerHTML = "A9 00 8D 00 00 A9 00 8D 3B 00 A9 01 8D 3B 00 A9 00 8D 3C 00 A9 02 8D 3C 00 A9 01 6D 3B 00 8D 3B 00 A9 03 6D 3C 00 8D 3C 00 AC 3B 00 A2 01 FF A0 3D A2 02 FF AC 3C 00 A2 01 FF 00 00 00 20 61 6E 64 20 00";
        }

        public static Program3_click(): void
        {
            document.getElementById("taProgramInput").innerHTML = "A9 00 8D 00 00 A9 00 8D 4B 00 A9 00 8D 4B 00 A2 03 EC 4B 00 D0 07 A2 01 EC 00 00 D0 05 A2 00 EC 00 00 D0 26 A0 4C A2 02 FF AC 4B 00 A2 01 FF A9 01 6D 4B 00 8D 4B 00 A2 02 EC 4B 00 D0 05 A0 55 A2 02 FF A2 01 EC 00 00 D0 C5 00 00 63 6F 75 6E 74 69 6E 67 00 68 65 6C 6C 6F 20 77 6F 72 6C 64 00";
        }

        public static Program4_click(): void
        {
            document.getElementById("taProgramInput").innerHTML = "A9 AD A2 A9 EC 10 00 8D 10 00 EE 08 00 D0 F8 00 00";
        }
        */

        public static updateMemoryDisplay(output) {
            document.getElementById("memDisplay").innerHTML = output;
            document.getElementById("assembledCode").innerHTML = assemblerCode;
        }

        public static updateAssemblerCode() {
            document.getElementById("assembledCode").innerHTML = assemblerCode;
        }

        public static updateCPUDisplay() {
            document.getElementById("cpuPC").innerHTML = String(_CPU.PC);
            document.getElementById("cpuACC").innerHTML = String(_CPU.Acc);
            document.getElementById("cpuX").innerHTML = String(_CPU.Xreg);
            document.getElementById("cpuY").innerHTML = String(_CPU.Yreg);
            document.getElementById("cpuZ").innerHTML = String(_CPU.Zflag);
        }

        public static updateRQDisplay() {
            var display = "";
            if (_CPU.isExecuting) {

                if (executingProgram !== null) {
                    display += "<tr>";
                    display += "<td> " + executingProgram.PID + "</td>";
                    display += "<td> " + executingProgram.PC + "</td>";
                    display += "<td> " + executingProgram.Instruction + "</td>";
                    display += "<td> " + executingProgram.Acc + "</td>";
                    display += "<td> " + executingProgram.Xreg + "</td>";
                    display += "<td> " + executingProgram.Yreg + "</td>";
                    display += "<td> " + executingProgram.Zflag + "</td>";
                    display += "<td> " + States[executingProgram.state] + "</td>";
                    display += "<tr>";
                }
                for (var i = 0; i < scheduler.readyQueue.getSize(); i++) {
                    display += "<tr>";
                    display += "<td> " + scheduler.readyQueue.getPCB(i).PID + "</td>";
                    display += "<td> " + scheduler.readyQueue.getPCB(i).PC + "</td>";
                    display += "<td> " + scheduler.readyQueue.getPCB(i).Instruction + "</td>";
                    display += "<td> " + scheduler.readyQueue.getPCB(i).Acc + "</td>";
                    display += "<td> " + scheduler.readyQueue.getPCB(i).Xreg + "</td>";
                    display += "<td> " + scheduler.readyQueue.getPCB(i).Yreg + "</td>";
                    display += "<td> " + scheduler.readyQueue.getPCB(i).Zflag + "</td>";
                    display += "<td> " + States[scheduler.readyQueue.getPCB(i).state] + "</td>";
                    display += "<tr>";

                }
                document.getElementById("RQBox").innerHTML = display;
            } else if (!_CPU.isExecuting) {
                display += "<tr>";
                display += "<td></td>";
                display += "<td></td>";
                display += "<td></td>";
                display += "<td></td>";
                display += "<td></td>";
                display += "<td></td>";
                display += "<td></td>";
                display += "<td></td>";
                display += "<tr>";
                document.getElementById("RQBox").innerHTML = display;
            }
        }

        public static updateHardDrive() {
            var output = "";
            var block = "";
            var meta = "";
            var tsb = ""

            for (var t = 0; t < _krnHardDrive.tracks; t++) {
                for (var s = 0; s < _krnHardDrive.sectors; s++) {
                    for (var b = 0; b < _krnHardDrive.blocks; b++) {
                        tsb = t + "" + s + "" + b;
                        block = _krnHardDrive.getData(tsb);
                        meta = _krnHardDrive.getMetaData(tsb);

                        output += "<tr><td>" + t + ":" + s + ":" + b + "</td>";
                        if (meta.charAt(0) === "1") {
                            output += "<td>" + "<b>" + meta.charAt(0) + "</b>" + meta.substring(1, 4) + "</td>";
                            output += "<td>" + block + "</td></tr>";
                        }
                        else {
                            //trick the user into think they're data is deleted
                            output += "<td>" + "<b>" + meta.charAt(0) + "</b>" + "000" + "</td>";
                            output += "<td>" + new Array(block.length + 1).join('0') + "</td></tr>";
                        }

                    }
                }
            }
            document.getElementById("hardDriveDisplay").innerHTML = output;
        }


    }
}
