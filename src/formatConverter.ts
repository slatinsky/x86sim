// all integers stored are signed shorts if else not specified
import type {typeBase, typeSelectedFormat} from "./types/types";
import {parseInt as baseConverter} from 'all-your-base';

/**
 * converts signed integer to unsigned integer
 */
export function signedToUnsignedInt(signedInt, bits) {
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
        console.error('signedToUnsignedInt - unsupported bits amount - ' +  bits)
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
        console.error('unsignedToSignedInt - unsupported bits amount - ' +  bits)
        return unsignedInt
    }
}

/**
 * Calculates overflow in signed integer based on available bits
 */
export function handleOverflow(signedInt, bits) {
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
export function formattedStringToInt(baseString: string, selectedFormat: typeSelectedFormat, bits: number): number {
    if (baseString ===  "") {
        return 0
    }
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

/**
 * tries to parse string from multiple formats to signed dec
 *
 * bin -> signed dec
 * hex -> signed dec
 * signed dec -> signed dec
 */
export function autodetectToSignedInteger(numberString: string): number {
    if (/^'.'$/i.test(numberString)) {  // char
        return numberString.charCodeAt(1)
    }
    else if (/^0b[01]+$/i.test(numberString)) {
        return formattedStringToInt(numberString.replace(/^0b/, ''), 'bin', 16)
    }
    else if (/^0x[0-9a-f]+$/i.test(numberString)) {
        return formattedStringToInt(numberString.replace(/^0x/, ''), 'hex', 16)
    }
    else if (/^[0-9a-f]+h$/i.test(numberString)) {
        return formattedStringToInt(numberString.replace(/h$/, ''), 'hex', 16)
    }
    else {
        return parseInt(numberString)
    }
}

/**
 * splits 16 bit signed value to two 8 bit values
 * automatically handles overflow
 *
 * return [lower 8bit signed, higher 8bit signed]
 */
export function split16bitToTwo8bit(input16bit: number): [number, number] {
    let unsignedInt = signedToUnsignedInt(input16bit, 16)  // handles overflow too, now variable is guaranteed to be in range <0; 65535>
    let highValueUnsigned = (unsignedInt & 0xff00) >>> 8
    let lowValueUnsigned = unsignedInt & 0xff
    return [unsignedToSignedInt(lowValueUnsigned, 8), unsignedToSignedInt(highValueUnsigned, 8)]
}

/**
 * merges  [lower 8bit signed, higher 8bit signed] to 16bit signed
 * automatically handles overflow
 */
export function mergeTwo8bitTo16bit(lowValueSigned: number, highValueSigned: number): number {
    let lowValueUnsigned = signedToUnsignedInt(lowValueSigned, 8)
    let highValueUnsigned = signedToUnsignedInt(highValueSigned, 8)
    let merged16bitUnsigned = lowValueUnsigned + (highValueUnsigned << 8)
    return unsignedToSignedInt(merged16bitUnsigned, 16)
}



// TODO: port ugly console tests to test library
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

// console.log("test 15", split16bitToTwo8bit(-1), "=", '[-1, -1]')
// console.log("test 16", split16bitToTwo8bit(256), "=", '[0, 1]')
// console.log("test 17", split16bitToTwo8bit(99999999), "=", 'does it overflow to range [<-127; 128>, <-127; 128>]?')
//
// console.log("test 18", mergeTwo8bitTo16bit(-1, -1), "=", '-1')
// console.log("test 19", mergeTwo8bitTo16bit(0, 1), "=", '256')

