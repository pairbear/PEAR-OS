///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
            this.G_UserProgram = "";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            //date
            sc = new TSOS.ShellCommand(this.shellDate, "date", " - This displays the date and time.");
            this.commandList[this.commandList.length] = sc;
            //Where Am I
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", " - This displays where you are.");
            this.commandList[this.commandList.length] = sc;
            //Plays my own Version of Zork
            sc = new TSOS.ShellCommand(this.shellMyZork, "zork", "- Plays the PEAR-OS version of Zork");
            this.commandList[this.commandList.length] = sc;
            //sets the status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "- sets the status ");
            this.commandList[this.commandList.length] = sc;
            //Tells you the cake is a lie even though you should already know that
            sc = new TSOS.ShellCommand(this.shellCake, "cake", "- find out");
            this.commandList[this.commandList.length] = sc;
            //Initiates the Blue Screen of Death
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", " - This tests when the kernel traps an OS error");
            this.commandList[this.commandList.length] = sc;
            //loads programs into memory
            sc = new TSOS.ShellCommand(this.shellLoad, "load", " - runs a test to validate the user code in HTML5");
            this.commandList[this.commandList.length] = sc;
            //runs programs from memory
            sc = new TSOS.ShellCommand(this.shellRun, "run", " - runs the loaded user code");
            this.commandList[this.commandList.length] = sc;
            //runs all programs in memory
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", " - runs the all the loaded user code");
            this.commandList[this.commandList.length] = sc;
            //kills an active process
            sc = new TSOS.ShellCommand(this.shellKill, "kill", " - kills running process's");
            this.commandList[this.commandList.length] = sc;
            //clears the memory
            sc = new TSOS.ShellCommand(this.shellClearMemory, "clearmem", " - clears the memory");
            this.commandList[this.commandList.length] = sc;
            //set the quantum
            sc = new TSOS.ShellCommand(this.shellSetQuantum, "quantum", " - sets the quantum for the CPU Scheduler ");
            this.commandList[this.commandList.length] = sc;
            //displays running processes
            sc = new TSOS.ShellCommand(this.shellDisplayRunningProcesses, "ps", " - Displays process currently being executed ");
            this.commandList[this.commandList.length] = sc;
            //sets the schedule type
            sc = new TSOS.ShellCommand(this.shellSelectScheduleType, "setschedule", " - select rr, fcfs, or priority as your scheduling type");
            this.commandList[this.commandList.length] = sc;
            //creates a file
            sc = new TSOS.ShellCommand(this.shellCreate, "create", " - creates a file");
            this.commandList[this.commandList.length] = sc;
            //reads a file
            sc = new TSOS.ShellCommand(this.shellRead, "read", " - reads the selected file");
            this.commandList[this.commandList.length] = sc;
            //writes to a file
            sc = new TSOS.ShellCommand(this.shellWrite, "write", " - writes your text to designated file");
            this.commandList[this.commandList.length] = sc;
            //deletes a file
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", " - deletes a file");
            this.commandList[this.commandList.length] = sc;
            //formats the hard drive
            sc = new TSOS.ShellCommand(this.shellFormat, "format", " - formats the hard drive");
            this.commandList[this.commandList.length] = sc;
            //shows the files in the hard drive
            sc = new TSOS.ShellCommand(this.shellLS, "ls", " - shows a list of files on the hard drive");
            this.commandList[this.commandList.length] = sc;
            // displays the schedule type
            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getschedule", " - shows the current scheduling algorithm");
            this.commandList[this.commandList.length] = sc;
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            if (fn !== this.shellBSOD && fn !== this.shellShutdown) {
                // ... and finally write the prompt again.
                this.putPrompt();
            }
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function (args) {
            var date = new Date();
            _StdOut.putText("The Current Date is " + date.toLocaleDateString() + " " + date.toLocaleTimeString());
        };
        Shell.prototype.shellWhereAmI = function (args) {
            _StdOut.putText("You are in Narnia.");
        };
        Shell.prototype.shellMyZork = function (args) {
            _StdOut.putText("when I put this here, I forgot/ didn't realize");
            _StdOut.advanceLine();
            _StdOut.putText("I would have to rewrite my program from Alan's SD1 class.");
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                var status = "";
                for (var i = 0; i < args.length; ++i) {
                    status += args[i] + " ";
                }
                _StdOut.putText("Status updated to " + status);
                Status.textContent = "status: " + status;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };
        // runs a fun extra function, I'm going to add a picture of a cake later :)
        Shell.prototype.shellCake = function (args) {
            _StdOut.putText("The Cake is a Lie");
        };
        // runs a kernel trap error to test the bsod
        Shell.prototype.shellBSOD = function (args) {
            _Kernel.krnTrapError("BSOD, muahahahahaha");
        };
        Shell.prototype.shellLoad = function (args) {
            var userInput = document.getElementById("taProgramInput").value;
            var priority = args[0];
            this.G_UserProgram = userInput;
            if (!userInput.match(/^0|1|2|3|4|5|6|7|8|9|"a"|"b"|"c"|"d"|"e"|"f"| "g"$/)) {
                _StdOut.putText("you call that hex?!");
            }
            else {
                var programString = userInput.split(" ");
                if (memoryManager.nextOpenMemoryBlock === null) {
                    globalFileContent = userInput;
                    _StdOut.putText("Memory full, loading program to Hard drive");
                    _StdOut.advanceLine();
                    _StdOut.putText("PID: " + scheduler.loadProgramToHardDrive(programString, priority));
                }
                else {
                    _StdOut.putText("PID: " + scheduler.loadProgramToMemory(programString, priority));
                }
            }
        };
        Shell.prototype.shellRun = function (args) {
            _StdOut.putText("Running program " + args);
            executingProgramPID = parseInt(args[0]);
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_EXECUTE_PROGRAM, 4));
        };
        Shell.prototype.shellRunAll = function (args) {
            _StdOut.putText("Running all programs");
            executingProgramPID = parseInt(args[0]);
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_EXECUTE_PROGRAM, "all"));
        };
        Shell.prototype.shellKill = function (args) {
            _StdOut.putText("Killing Program " + args);
            var PID = parseInt(args[0]);
            scheduler.killProcess(PID);
        };
        Shell.prototype.shellClearMemory = function (args) {
            _StdOut.putText("Clearing memory");
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEMORY_CLEAR_IRQ, 6));
        };
        Shell.prototype.shellSetQuantum = function (args) {
            quantum = args;
            _StdOut.putText("quantum set to " + args);
        };
        Shell.prototype.shellDisplayRunningProcesses = function (args) {
            var pid = "";
            for (var i = 0; i < scheduler.readyQueue.getSize(); i++)
                pid += ", PID: " + scheduler.readyQueue.getPCB(i);
            _StdOut.putText("Current running processes... ");
            _StdOut.putText("PID: " + executingProgramPID + pid);
        };
        Shell.prototype.shellSelectScheduleType = function (args) {
            var type = args[0];
            scheduleType = type;
            if (type !== "rr" && type !== "fcfs" && type !== "priority") {
                _StdOut.putText("That's not a schedule type...");
            }
            else {
                scheduler.schedulerType(type);
                _StdOut.putText("Schdule type set to " + type);
            }
        };
        Shell.prototype.shellCreate = function (args) {
            var fileName = args[0];
            option = true;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CREATE_IRQ, fileName));
        };
        Shell.prototype.shellRead = function (args) {
            var fileName = args[0];
            option = true;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(READ_IRQ, fileName));
        };
        Shell.prototype.shellWrite = function (args) {
            var fileName = args[0];
            var fileContent = "";
            if (args[1].length > 0) {
                var fileContent = "";
                for (var i = 1; i < args.length; ++i) {
                    fileContent += args[i] + " ";
                }
            }
            debugger;
            if (fileContent.charAt(0) === '"' && fileContent.charAt(fileContent.length - 2) === '"') {
                globalFileContent = fileContent;
                option = true;
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_IRQ, fileName));
            }
            else {
                _StdOut.putText("Please put quotes around the designated content");
                _StdOut.advanceLine();
            }
        };
        Shell.prototype.shellDelete = function (args) {
            var fileName = args[0];
            _StdOut.putText("Deleting file " + fileName);
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DELETE_IRQ, fileName));
        };
        Shell.prototype.shellFormat = function () {
            _StdOut.putText("Formatting Hard Drive");
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FORMAT_IRQ, 0));
        };
        Shell.prototype.shellLS = function () {
            //var files = fileNamesList;
            _StdOut.putText("Current files on hard drive:");
            _StdOut.advanceLine();
            for (var i = 0; i < fileNamesList.getSize(); i++) {
                _StdOut.putText(fileNamesList.getPCB(i));
                if (i < fileNamesList.getSize() - 1)
                    (_StdOut.putText(", "));
            }
        };
        Shell.prototype.shellGetSchedule = function () {
            _StdOut.putText("The current schedule type is " + scheduleType);
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
