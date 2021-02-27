// all integers stored are signed shorts if else not specified
import type {typeBase, typeSelectedFormat} from "./types/types";
import {parseInt as baseConverter} from 'all-your-base';

/**
 * converts signed integer to unsigned integer
 */
function signedToUnsignedInt(signedInt, bits) {
    if (bits === 16) {
        // more info https://stackoverflow.com/a/26537349/14409632
        return (new Uint16Array([signedInt]))[0]
    }
    else if (bits === 8) {
        return (new Uint8Array([signedInt]))[0]
    }
    else if (bits === 1){
        return Math.abs(signedInt)
    }
    else if (bits === 32) {
        return (new Uint32Array([signedInt]))[0]
    }
    else {
        alert('signedToUnsignedInt - unsupported bits amount - ' +  bits)
        return signedInt
    }
}

/**
 * converts unsigned integer to signed integer
 */
function unsignedToSignedInt(unsignedInt, bits) {
    if (bits === 16) {
        return (new Int16Array([unsignedInt]))[0]
    }
    else if (bits === 8) {
        return (new Int8Array([unsignedInt]))[0]
    }
    else if (bits === 1){
        return unsignedInt
    }
    else if (bits === 32) {
        return (new Int32Array([unsignedInt]))[0]
    }
    else {
        alert('unsignedToSignedInt - unsupported bits amount - ' +  bits)
        return unsignedInt
    }
}

/**
 * Calculates overflow in signed integer based on available bits
 */
function handleOverflow(signedInt, bits) {
    // How is overflow handled?:
    // signed -> unsigned
    // calculate division remainder
    // unsigned -> signed
    let unsignedInt = signedToUnsignedInt(signedInt, bits)
    let unsignedIntWithoutOverflow = unsignedInt % Math.pow(2, bits)
    let signedIntWithoutOverflow = unsignedToSignedInt(unsignedIntWithoutOverflow, bits)
    return signedIntWithoutOverflow
}

/**
 * signed integer to formatted string
 */
export function intToFormattedString(int: number, selectedFormat: typeSelectedFormat, bits: number) {
    const [base, isDecSigned] = splitSelectedFormat(selectedFormat)
    int = handleOverflow(int, bits)
    if (base === 10 && isDecSigned) {
        return int.toString()
    }
    else if (base === 10 && !isDecSigned) {
        return signedToUnsignedInt(int, bits).toString()
    }
    else {
        // console.log("intToBaseWrapper", int, 10, base)
        let formattedString = baseConverter(signedToUnsignedInt(int, bits), 10, base)
        if (formattedString === "")
            return "0"
        else
            return formattedString
    }
}

/**
 * formatted string to signed integer
 */
export function formattedStringToInt(baseString: string, selectedFormat: typeSelectedFormat, bits: number) {
    const [base, isDecSigned] = splitSelectedFormat(selectedFormat)
    let parsedValue
    if (base === 10 && isDecSigned) {
        // signed int (in base 10) is default - just convert string to int
        parsedValue = parseInt(baseString)
    }
    else if (base === 10 && !isDecSigned) {
        // convert unsigned int (represented as string) to signed int
        parsedValue = unsignedToSignedInt(parseInt(baseString), bits)
    }
    else {
        // console.log("baseToIntWrapper", baseString, base, 10)
        let convertedInt = baseConverter(baseString, base, 10)
        parsedValue = unsignedToSignedInt(convertedInt, bits)
    }
    // return parsedValue
    return handleOverflow(parsedValue, bits)
}


/**
 * Accepts selectedFormat: 'bin' | 'hex' | 'signed' | 'unsigned'
 * Returns [base: 2 | 10 | 16, isDecSigned: boolean]
 */
export function splitSelectedFormat(selectedFormat: typeSelectedFormat): [typeBase, boolean] {
    if (selectedFormat === 'bin') {
        return [2, false]
    }
    else if (selectedFormat === 'hex') {
        return [16, false]
    }
    else if (selectedFormat === 'signed') {
        return [10, true]
    }
    else if (selectedFormat === 'unsigned') {
        return [10, false]
    }
    else {  // if invalid, return default
        console.error('splitSelectedFormat - invalid selectedFormat:', selectedFormat)
        return [10, true]
    }
}

/**
 * Accepts base: 2 | 10 | 16, isDecSigned: boolean
 * Returns selectedFormat: 'bin' | 'hex' | 'signed' | 'unsigned'
 */
function mergeSelectedFormat(base: typeBase, decSigned: boolean): typeSelectedFormat {
    if (base === 2) {
        return 'bin'
    }
    else if (base === 16) {
        return 'hex'
    }
    else if (base === 10 && !decSigned) {
        return 'unsigned'
    }
    else if (base === 10 && decSigned) {
        return 'signed'
    }
    else {
        console.error('splitSelectedFormat - invalid base or decSigned:', base, decSigned)
        return 'signed'
    }
}

// TODO: port ugly tests to test library
// console.log("test 1", signedToUnsignedInt(-1, 16), "=", 65535)
// console.log("test 2", unsignedToSignedInt(65535, 16), "=", -1)
// console.log("test 3", formattedStringToInt('fe0c', 'hex', 16), "=", -500)
// console.log("test 4", formattedStringToInt('ffff', 'hex', 16), "=", -1)
// console.log("test 5", formattedStringToInt('8000', 'hex', 16), "=", -32768)
// console.log("test 6", formattedStringToInt('7fff', 'hex', 16), "=", 32767)
// console.log("test 7", intToFormattedString(-500, 'hex', 16), "=", 'fe0c')
// console.log("test 8", intToFormattedString(-1, 'hex', 16), "=", 'ffff')
// console.log("test 9", intToFormattedString(-32768, 'hex', 16), "=", '8000')
// console.log("test 10", intToFormattedString(32767, 'hex', 16), "=", '7fff')
//
// console.log("test 11", formattedStringToInt('0', 'unsigned', 16), "=", 0)
// console.log("test 12", formattedStringToInt('65535', 'unsigned', 16), "=", -1)
// console.log("test 13", intToFormattedString(0, 'unsigned', 16), "=", '0')
// console.log("test 14", intToFormattedString(-1, 'unsigned', 16), "=", '65535')
