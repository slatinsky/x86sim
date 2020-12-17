// all integers stored are signed shorts if else not specified


function signedToUnsignedInt(signedInt, bits) {
    if (bits === 16) {
        // more info https://stackoverflow.com/a/26537349/14409632
        return (new Uint16Array([signedInt]))[0]
    }
    else if (bits === 2){
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
    else if (bits === 2){
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

export function intToBaseWrapper(int, selectedFormat, bits) {
    if (selectedFormat === 'bin') {
        return intToBase(int, 2, bits)
    }
    else if (selectedFormat === 'hex') {
        return intToBase(int, 16, bits)
    }
    else if (selectedFormat === 'signed') {
        return intToBase(int, 10, bits, false)
    }
    else if (selectedFormat === 'unsigned') {
        return intToBase(int, 10, bits, true)
    }
    else {
        console.error('intToBaseWrapper - wrong selectedFormat:', selectedFormat)
    }
}

// unsigned parameter is used only if base is 10
function intToBase(int, base= 16, bits = 16, unsigned= true) {
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
        if (unsigned) {
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

export function baseToIntWrapper(baseString, selectedFormat, bits) {
    if (selectedFormat === 'bin') {
        return baseToInt(baseString, 2, bits)
    }
    else if (selectedFormat === 'hex') {
        return baseToInt(baseString, 16, bits)
    }
    else if (selectedFormat === 'signed') {
        return baseToInt(baseString, 10, bits, false)
    }
    else if (selectedFormat === 'unsigned') {
        return baseToInt(baseString, 10, bits, true)
    }
    else {
        console.error('baseToIntWrapper - wrong selectedFormat:', selectedFormat)
    }
}

function baseToInt(baseString, base= 16, bits = 16, unsigned= true) {
    let characterBlacklistRegex;
    let allowedCharacterCount;


    // --- settings based on parameters ---

    if (base === 16) {
        unsigned = true
        // remove characters other than numbers and a-f
        characterBlacklistRegex = /[^0-9a-f]/gm
        allowedCharacterCount = Math.ceil(bits / 4)
    }
    else if (base === 2) {
        unsigned = true
        characterBlacklistRegex = /[^0-1]/gm
        allowedCharacterCount = bits
    }
    else if (base === 10) {
        if (unsigned) {
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


