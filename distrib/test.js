//
// glados.js - It's for testing. And enrichment.
//

function Glados() {
    this.version = 2112;

    this.init = function() {
        var msg = "Hello [subject name here]. Let's test project THR.\n";
        //alert(msg);
    };

    this.afterStartup = function() {

        // Force scrolling with a few 'help' commands.
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('h');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue('u');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('p');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('o');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('y');

        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);



        // Load THREE (slightly different) valid user programs code and run them. The differences are . . .                                          . . .                                        here                                                        . . .                                                                                                                                   . . . and here.
        // 1 2 done
        var code1 = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00";
        // 2 and 5
        var code2 = "A9 00 8D 00 00 A9 00 8D 3B 00 A9 01 8D 3B 00 A9 00 8D 3C 00 A9 02 8D 3C 00 A9 01 6D 3B 00 8D 3B 00 A9 03 6D 3C 00 8D 3C 00 AC 3B 00 A2 01 FF A0 3D A2 02 FF AC 3C 00 A2 01 FF 00 00 00 20 61 6E 64 20 00";
        // alans long ass test thing
        var code3 = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 09 AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 63 00 63 64 6F 6E 65 00";
        // counting stuffs
        var code4 = "A9 00 8D 00 00 A9 00 8D 4B 00 A9 00 8D 4B 00 A2 03 EC 4B 00 D0 07 A2 01 EC 00 00 D0 05 A2 00 EC 00 00 D0 26 A0 4C A2 02 FF AC 4B 00 A2 01 FF A9 01 6D 4B 00 8D 4B 00 A2 02 EC 4B 00 D0 05 A0 55 A2 02 FF A2 01 EC 00 00 D0 C5 00 00 63 6F 75 6E 74 69 6E 67 00 68 65 6C 6C 6F 20 77 6F 72 6C 64 00"

        // 1 2 done
        setTimeout(function(){ document.getElementById("taProgramInput").value = code1;
            _KernelInputQueue.enqueue('l');
            _KernelInputQueue.enqueue('o');
            _KernelInputQueue.enqueue('a');
            _KernelInputQueue.enqueue('d');
            _KernelInputQueue.enqueue(' ');
            _KernelInputQueue.enqueue('7');
            //_KernelInputQueue.enqueue('');
            TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
        }, 1000);

        //2 and 5
        setTimeout(function(){ document.getElementById("taProgramInput").value = code2;
            _KernelInputQueue.enqueue('l');
            _KernelInputQueue.enqueue('o');
            _KernelInputQueue.enqueue('a');
            _KernelInputQueue.enqueue('d');
            _KernelInputQueue.enqueue(' ');
            _KernelInputQueue.enqueue('1');
           //_KernelInputQueue.enqueue('');
            TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
        }, 2000);

        // alans test thing
        setTimeout(function(){ document.getElementById("taProgramInput").value = code3;
            _KernelInputQueue.enqueue('l');
            _KernelInputQueue.enqueue('o');
            _KernelInputQueue.enqueue('a');
            _KernelInputQueue.enqueue('d');
            _KernelInputQueue.enqueue(' ');
            _KernelInputQueue.enqueue('1');
            _KernelInputQueue.enqueue('0');
            TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
        }, 3000);

        // counting
        setTimeout(function(){ document.getElementById("taProgramInput").value = code4;
            _KernelInputQueue.enqueue('l');
            _KernelInputQueue.enqueue('o');
            _KernelInputQueue.enqueue('a');
            _KernelInputQueue.enqueue('d');
            //_KernelInputQueue.enqueue('');
            //_KernelInputQueue.enqueue('');
            //_KernelInputQueue.enqueue('');
            TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
        }, 4000);

        setTimeout(function(){
            _KernelInputQueue.enqueue('r');
            _KernelInputQueue.enqueue('u');
            _KernelInputQueue.enqueue('n');
            _KernelInputQueue.enqueue('a');
            _KernelInputQueue.enqueue('l');
            _KernelInputQueue.enqueue('l');
            TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
        }, 5000);
    };

}