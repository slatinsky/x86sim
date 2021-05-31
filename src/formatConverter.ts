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
    else if (bits < 32) {
        return (signedInt << (32 - bits)) >>> (32 - bits)   // >>> = Unsigned right shift
    }
    else {
        console.error('signedToUnsignedInt - unsupported bits amount - ' +  bits)
        return signedInt
    }
}

/**
 * converts unsigned integer to signed integer
 */
export function unsignedToSignedInt(unsignedInt, bits) {
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
    else if (bits < 32) {
        // clever trick from https://stackoverflow.com/questions/15389608/signed-to-unsigned-and-vice-versa-arithmetical :
        // "As a side note the reason the solution works is because if you bit shift to the right 16 times, the most significant bit of your 16 bit number will actually become the most significant bit of the 32 bit JavaScript integer (so if the most significant bit was a 1, it'd make the number negative), and so when you shift it to the left 16 times it'd shift while keeping the standard 2s complement form and retain the value/sign it gained from being shifted to the right previously, see this Wikipedia article for more: https://en.m.wikipedia.org/wiki/Arithmetic_shift"
        return (unsignedInt << (32 - bits)) >> (32 - bits)
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
    else if (/^[01]+b$/i.test(numberString)) {
        return formattedStringToInt(numberString.replace(/b$/, ''), 'bin', 16)
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


/**
 * Supports extended ascii too
 */
export function valueToAscii(signedValue: number) {
    let unsignedValue = signedToUnsignedInt(signedValue, 8)  % 256

    // windows1252 map from https://stackoverflow.com/a/13637085/14409632
    let windows1252 = [
        '0x0000','\u0001','\u0002','\u0003','\u0004','\u0005','\u0006','\u0007','\u0008','\u0009','\u000A','\u000B','\u000C','\u000D','\u000E','\u000F'
        ,'\u0010','\u0011','\u0012','\u0013','\u0014','\u0015','\u0016','\u0017','\u0018','\u0019','\u001A','\u001B','\u001C','\u001D','\u001E','\u001F'
        ,'\u0020','\u0021','\u0022','\u0023','\u0024','\u0025','\u0026','\u0027','\u0028','\u0029','\u002A','\u002B','\u002C','\u002D','\u002E','\u002F'
        ,'\u0030','\u0031','\u0032','\u0033','\u0034','\u0035','\u0036','\u0037','\u0038','\u0039','\u003A','\u003B','\u003C','\u003D','\u003E','\u003F'
        ,'\u0040','\u0041','\u0042','\u0043','\u0044','\u0045','\u0046','\u0047','\u0048','\u0049','\u004A','\u004B','\u004C','\u004D','\u004E','\u004F'
        ,'\u0050','\u0051','\u0052','\u0053','\u0054','\u0055','\u0056','\u0057','\u0058','\u0059','\u005A','\u005B','\u005C','\u005D','\u005E','\u005F'
        ,'\u0060','\u0061','\u0062','\u0063','\u0064','\u0065','\u0066','\u0067','\u0068','\u0069','\u006A','\u006B','\u006C','\u006D','\u006E','\u006F'
        ,'\u0070','\u0071','\u0072','\u0073','\u0074','\u0075','\u0076','\u0077','\u0078','\u0079','\u007A','\u007B','\u007C','\u007D','\u007E','\u007F'
        ,'\u20AC','\uFFFD','\u201A','\u0192','\u201E','\u2026','\u2020','\u2021','\u02C6','\u2030','\u0160','\u2039','\u0152','\uFFFD','\u017D','\uFFFD'
        ,'\uFFFD','\u2018','\u2019','\u201C','\u201D','\u2022','\u2013','\u2014','\u02DC','\u2122','\u0161','\u203A','\u0153','\uFFFD','\u017E','\u0178'
        ,'\u00A0','\u00A1','\u00A2','\u00A3','\u00A4','\u00A5','\u00A6','\u00A7','\u00A8','\u00A9','\u00AA','\u00AB','\u00AC','\u00AD','\u00AE','\u00AF'
        ,'\u00B0','\u00B1','\u00B2','\u00B3','\u00B4','\u00B5','\u00B6','\u00B7','\u00B8','\u00B9','\u00BA','\u00BB','\u00BC','\u00BD','\u00BE','\u00BF'
        ,'\u00C0','\u00C1','\u00C2','\u00C3','\u00C4','\u00C5','\u00C6','\u00C7','\u00C8','\u00C9','\u00CA','\u00CB','\u00CC','\u00CD','\u00CE','\u00CF'
        ,'\u00D0','\u00D1','\u00D2','\u00D3','\u00D4','\u00D5','\u00D6','\u00D7','\u00D8','\u00D9','\u00DA','\u00DB','\u00DC','\u00DD','\u00DE','\u00DF'
        ,'\u00E0','\u00E1','\u00E2','\u00E3','\u00E4','\u00E5','\u00E6','\u00E7','\u00E8','\u00E9','\u00EA','\u00EB','\u00EC','\u00ED','\u00EE','\u00EF'
        ,'\u00F0','\u00F1','\u00F2','\u00F3','\u00F4','\u00F5','\u00F6','\u00F7','\u00F8','\u00F9','\u00FA','\u00FB','\u00FC','\u00FD','\u00FE','\u00FF'
    ]

    if (unsignedValue < 0x20 || [0x81, 0x8D, 0x8f, 0x90, 0x9D].includes(unsignedValue)) {  // non printable characters
        return " "
    }
    else {
        return windows1252[unsignedValue]
    }
}
