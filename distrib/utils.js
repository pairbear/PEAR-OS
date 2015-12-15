/* --------
 Utils.ts

 Utility functions.
 -------- */
var TSOS;
(function (TSOS) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.trim = function (str) {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
             Huh? WTF? Okay... take a breath. Here we go:
             - The "|" separates this into two expressions, as in A or B.
             - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
             - "\s+$" is the same thing, but at the end of the string.
             - "g" makes is global, so we get all the whitespace.
             - "" is nothing, which is what we replace the whitespace with.
             */
        };
        Utils.rot13 = function (str) {
            /*
             This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
             You can do this in three lines with a complex regular expression, but I'd have
             trouble explaining it in the future.  There's a lot to be said for obvious code.
             */
            var retVal = "";
            for (var i in str) {
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };
        Utils.createHexIndex = function (numDec) {
            var numHex = numDec.toString(16).toUpperCase();
            return "0x" + Array(3 - (numHex.length - 1)).join("0") + numHex;
        };
        Utils.stringToHexConverter = function (str) {
            var tempString = "";
            for (var i = 0; i < str.length; ++i) {
                tempString += str.charCodeAt(i).toString(16);
            }
            return tempString;
        };
        Utils.hexToStringConverter = function (str) {
            var hexString = "";
            for (var i = 0; i < str.length; ++i) {
                hexString += String.fromCharCode(parseInt(str.substr(i, 2), 16));
                ++i;
            }
            return hexString;
        };
        Utils.stringsplitter = function (data, limit) {
            var dataArray = [];
            var strArr = data.split('');
            for (var i = 0; i < strArr.length; i += limit) {
                if (i + limit > strArr.length)
                    dataArray.push(strArr.slice(i, strArr.length).join(""));
                else
                    dataArray.push(strArr.slice(i, i + limit).join(""));
            }
            return dataArray;
        };
        Utils.removeUnwantedSymbols = function (program) {
            // there were really strange symbols trailing the programs, so this eliminates them
            var dirtyContent = program;
            var retVal = "";
            var cleanContent = "";
            //var theCleanestContent = ""
            dirtyContent = program.replace(/ /g, '');
            var dirtyContent = dirtyContent.match(/.{2}/g);
            for (var i = 0; i < program.length; i++) {
                retVal = dirtyContent.shift();
                cleanContent += this.exists(retVal);
            }
            //debugger;
            /*for (var i = 0; i < program.length; i++) {
                var string = cleanContent, substring = "undefined";
                var location = 0;
                location += string.indexOf(substring);
                theCleanestContent += string.slice(0, location);
                cleanContent = string.slice(theCleanestContent.length +11, cleanContent.length);
                //theCleanestContent= str.replace( new RegExp("^.{0," +location+ "}(.*)"),  "$1" );
                //cleanContent.split("undefined").pop();

            } */
            return cleanContent;
        };
        Utils.exists = function (value) {
            if (value !== undefined && value.match(/^0|1|2|3|4|5|6|7|8|9|"A"|"B"|"C"|"D"|"E"|"F"|"G"$/)) {
                return value;
            }
            else if (value == "AD" || value == "AE" || value == "AC" || value == "EA" || value == "EC" || value == "EE" || value == "FF" || value == "EF" || value == "A0" || value == "D0") {
                return value;
            }
            else {
                var str = "00";
                return str;
            }
        };
        return Utils;
    })();
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
