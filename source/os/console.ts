///<reference path="../globals.ts" />

/* ------------
 Console.ts

 Requires globals.ts

 The OS Console - stdIn and stdOut by default.
 Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
 ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public commandHistory = [""],
                    public previousCommands = 0,
                    public buffer = "",
                    public previousLine = []) {
        }

        public init():void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen():void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private clearLine():void {

            _DrawingContext.fillStyle = "#DFDBC3";
            _DrawingContext.fillRect(0, this.currentYPosition - _DefaultFontSize, _Canvas.width, _DefaultFontSize + _FontHeightMargin + 1);
            this.currentXPosition = 0;
            this.buffer = "";

        }

        private resetXY():void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput():void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.commandHistory.push(this.buffer);
                    this.previousCommands = this.commandHistory.length;
                    this.buffer = "";


                } else if (chr === String.fromCharCode(8)) {
                    this.deleteCharacter();

                } else if (chr === String.fromCharCode(38) ||
                    chr === String.fromCharCode(40)) {

                    this.putText("");
                    this.buffer = "";
                    this.getPreviousCommand(chr);

                } else if (chr === String.fromCharCode(8)) {

                    //this.autoComplete(chr);
                }

                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text):void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.

            if (text !== "" && text.length === 1) {
                this.putChar(text);

            }
            else if (text !== "" && text.length > 1) {
                var words = text.split(" ");
                for (var i = 0; i < words.length; i++) {
                    var word = words[i];
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, word);
                    if (words.length > 1 && i !== words.length - 1) {
                        word += " ";
                    }
                    if (this.currentXPosition + offset > _Canvas.width) {
                        this.previousLine.push(this.currentXPosition);
                    }
                    for (var j = 0; j < word.length; j++) {
                        this.putChar(word.charAt(j));

                    }
                }
            }
        }

        public putChar(text:string):void {
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            if (this.currentXPosition + offset > _Canvas.width) {
                this.previousLine.push(this.currentXPosition);
                this.advanceLine();
            }
            _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
            this.currentXPosition = this.currentXPosition + offset;
        }


        public advanceLine():void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;

            // This scrolls the canvas
            if (this.currentYPosition >= _Canvas.height) {
                var canvas = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                this.clearScreen();
                _DrawingContext.putImageData(canvas, 0, _Canvas.height - this.currentYPosition - 12, 0, 0, _Canvas.width, _Canvas.height);
                this.currentYPosition -= _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
            }
        }

        // This displays the image for the blue screen of death
        public bsodDisplay(): void {
            var bsodImg = new Image();
            bsodImg.onload = function() {
                _DrawingContext.drawImage(bsodImg, 0, 0);
            };
            bsodImg.src = "http://i.imgur.com/3SXEdEA.jpg"

        }


        // this enables the backspace key to delete characters
        public deleteCharacter():void {
            if (this.buffer.length > 0) {
                var offset:number = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.slice(-1));
                var roundedXPos = Math.round(this.currentXPosition);
                if (roundedXPos <0 ) {
                    this.backLine(offset);
                }
                var xPosition:number = this.currentXPosition - offset;
                var roundedXPos = Math.round(this.currentXPosition);
                if (roundedXPos <0 )
                    this.backLine(offset);
                var yPosition:number = this.currentYPosition + 1 - this.currentFontSize;
                _DrawingContext.clearRect(xPosition, yPosition, this.currentXPosition, this.currentYPosition);
                this.currentXPosition = xPosition;
                this.buffer = this.buffer.substr(0, this.buffer.length - 1);
            }
        }

        public backLine(offset): void {
            this.currentXPosition = this.previousLine.pop() - offset;
            this.currentYPosition -= _DefaultFontSize + _FontHeightMargin; //decrease y
        }

        // This enables the up and down keys to be used to recall previously used commands
        public getPreviousCommand(chr):void {
            if ((chr === String.fromCharCode(38)) && (this.previousCommands > 0)) {
                this.clearLine();
                this.previousCommands--;
                _OsShell.putPrompt();
                this.putText(this.commandHistory[this.previousCommands]);
                this.buffer = this.commandHistory[this.previousCommands];
            } else if (chr === String.fromCharCode(40) && this.previousCommands > 0) {
                this.clearLine();
                this.previousCommands++;
                _OsShell.putPrompt();
                this.putText(this.commandHistory[this.previousCommands]);
                this.buffer = this.commandHistory[this.previousCommands];
            }
        }

        public systemOpCodeHandler():void {
            if (_CPU.Xreg === 1) {
                this.putText((_CPU.Yreg).toString());
                this.advanceLine();
                _OsShell.putPrompt();
            }
            else if (_CPU.Xreg === 2) {
                var string = "";
                var curPos = _CPU.Yreg + executingProgram.base;
                var curData = memoryManager.getMemory(curPos);
                while (curData !== "00") {
                    string += String.fromCharCode(memoryManager.convertHex(curData));
                    curData = memoryManager.getMemory(++curPos);
                }
                this.putText(string);
                this.advanceLine();
                _OsShell.putPrompt();
            }
        }


    }
}
