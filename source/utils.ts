/* --------
 Utils.ts

 Utility functions.
 -------- */

module TSOS {

    export class Utils {

        public static trim(str):string {
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
        }

        public static rot13(str:string):string {
            /*
             This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
             You can do this in three lines with a complex regular expression, but I'd have
             trouble explaining it in the future.  There's a lot to be said for obvious code.
             */
            var retVal:string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch:string = str[i];
                var code:number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }


        public static createHexIndex(numDec) {
            var numHex = numDec.toString(16).toUpperCase();
            return "0x" + Array(3 - (numHex.length - 1)).join("0") + numHex;
        }

        public static stringToHexConverter(str:string):string {
            var tempString:string = "";
            for (var i:number = 0; i < str.length; ++i) {
                tempString += str.charCodeAt(i).toString(16);
            }
            return tempString;
        }

        public static hexToStringConverter(str:string):string {
            var hexString:string = "";
            for (var i:number = 0; i < str.length; ++i) {
                hexString += String.fromCharCode(parseInt(str.substr(i, 2), 16));
                ++i;
            }
            return hexString;
        }

        public static stringSplitter(data:string, limit:number) {
            var dataArray = [];
            var strArr = data.split('');
            for (var i = 0; i < strArr.length; i += limit) {
                if (i + limit > strArr.length)
                    dataArray.push(strArr.slice(i, strArr.length).join(""));
                else
                    dataArray.push(strArr.slice(i, i + limit).join(""));
            }

            return dataArray;

        }

        public static removeZeroes(s, charToTrim) {
            var regExp = new RegExp(charToTrim + "+$");
           return s.replace(regExp, "");


        }

    }
}
