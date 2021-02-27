// all integers stored are signed shorts if else not specified
import type {typeBase, typeSelectedFormat} from "./types/types";
import error from "svelte/types/compiler/utils/error";

function signedToUnsignedInt(signedInt, bits) {
    if (bits === 16) {
        // more info https://stackoverflow.com/a/26537349/14409632
        return (new Uint16Array([signedInt]))[0]
    }
    else if (bits === 1){
        return signedInt
    }
    else {
        console.error('signedToUnsignedInt - unsuported bits amount - ', bits)
        return signedInt
    }
}

function unsignedToSignedInt(unsignedInt, bits) {
    if (bits === 16) {
        return (new Int16Array([unsignedInt]))[0]
    }
    else if (bits === 1){
        return unsignedInt
    }
    else {
        console.error('unsignedToSignedInt - unsuported bits amount - ', bits)
        return unsignedInt
    }
}

// How is overflow handled?:
// signed -> unsigned
// calculate division remainder
// unsigned -> signed
function handleOverflow(signedInt, bits) {
    let unsignedInt = signedToUnsignedInt(signedInt, bits)
    let unsignedIntWithoutOverflow = unsignedInt % Math.pow(2, bits)
    let signedIntWithoutOverflow = unsignedToSignedInt(unsignedIntWithoutOverflow, bits)
    return signedIntWithoutOverflow
}

// unsigned parameter is used only if base is 10
function intToBase(int, base: typeBase= 16, bits = 16, isDecSigned= false) {
    // signed char range -128 to 127
    // signed short range -32,768 to 32,767
    // Math.pow(2, 15) = 32768
    // Math.pow(2, 16) = 65536

    // int = (int + Math.pow(2, bits - 1)) % Math.pow(2, bits) - Math.pow(2, bits - 1)
    int = handleOverflow(int, bits)
    // TODO: return overflow bool alongside value if int before and after is different

    if (base === 16) {
        let unsignedInt = signedToUnsignedInt(int, bits)
        return unsignedInt.toString(16).padStart(Math.ceil(bits / 4), '0')
    } else if (base === 10) {
        if (!isDecSigned) {
            return signedToUnsignedInt(int, bits)
        }
        else {
            return int
        }
    } else if (base === 2) {
        let unsignedInt = signedToUnsignedInt(int, bits)
        return unsignedInt.toString(2).padStart(bits, '0')
    }
    else {
        console.error("baseToInt - unsupported base:", base)
        return NaN
    }
}



function baseToInt(baseString, base: typeBase = 16, bits = 16, isDecSigned= false) {
    let characterBlacklistRegex;
    let allowedCharacterCount;


    // --- settings based on parameters ---

    if (base === 16) {
        isDecSigned = false
        // remove characters other than numbers and a-f
        characterBlacklistRegex = /[^0-9a-f]/gm
        allowedCharacterCount = Math.ceil(bits / 4)
    }
    else if (base === 2) {
        isDecSigned = false
        characterBlacklistRegex = /[^0-1]/gm
        allowedCharacterCount = bits
    }
    else if (base === 10) {
        if (isDecSigned) {
            characterBlacklistRegex = /[^0-9]/gm
        }
        else {
            characterBlacklistRegex = /[^0-9-]/gm
        }
    }
    else {
        console.error("baseToInt - unsupported base:", base)
        return NaN
    }

    // --- run convertion ---

    let newValue = baseString


    //convert to string if it isn't already string
    newValue = newValue.toString()

    // remove disallowed characters
    newValue = newValue.replaceAll(characterBlacklistRegex, '')

    // remove zeros from the beginning
    newValue = newValue.replaceAll(/^0+/gm, '')


    if (allowedCharacterCount) {
        // allow only first x characters
        newValue = newValue.substring(0, allowedCharacterCount)
    }

    // if resulting string value is empty string, make it zero
    if (newValue.length === 0) {
        newValue = '0'
    }

    // parse string to integer
    let newValueInteger = parseInt(newValue, base)
    return newValueInteger

    //TODO: handle unsigned to signed convertion
}


export function intToBaseWrapper(int: number, selectedFormat: typeSelectedFormat, bits: number) {
    const [base, isDecSigned] = splitSelectedFormat(selectedFormat)
    return intToBase(int, base, bits, isDecSigned)
}


export function baseToIntWrapper(baseString: string, selectedFormat: typeSelectedFormat, bits: number) {
    const [base, isDecSigned] = splitSelectedFormat(selectedFormat)
    return baseToInt(baseString, base, bits, isDecSigned)
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
