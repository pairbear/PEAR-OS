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

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

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

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();
            var date = new Date();
            Time.textContent = "Time : " + date.toLocaleDateString() + " " + date.toLocaleTimeString();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
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


        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static updateMemoryDisplay(output)
        {
            document.getElementById("memDisplay").innerHTML = output;
            document.getElementById("assembledCode").innerHTML = assemblerCode;
        }

        public static updateAssemblerCode() {
            document.getElementById("assembledCode").innerHTML = assemblerCode;
        }

        public  static updateCPUDisplay() {
            document.getElementById("cpuPC").innerHTML = String(_CPU.PC);
            document.getElementById("cpuACC").innerHTML = String(_CPU.Acc);
            document.getElementById("cpuX").innerHTML = String(_CPU.Xreg);
            document.getElementById("cpuY").innerHTML = String(_CPU.Yreg);
            document.getElementById("cpuZ").innerHTML = String(_CPU.Zflag);
        }

        public  static updateRQDisplay() {
            var display = "";
            //alert(_CPU.isExecuting);
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
                alert("oh?!")
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


    }
}
