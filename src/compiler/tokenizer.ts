import {allIntelOpcodes, allIntelRegisters, allIntel16bitRegisters, allIntel8bitRegisters} from "../config"
import {autodetectToSignedInteger} from "../formatConverter";
import type {iToken, tTokenBits, tTokenType} from "@compiler/types";

function getTokenType(tokenContent: string): tTokenType {
    if (/^(word|byte) ptr$/i.test(tokenContent)) {
        return 'type_override'
    }
    else if (/^((0b[01]+)|([01]+b)|(0x[0-9a-f]+)|([0-9a-f]+h)|(-?[0-9]+))$/i.test(tokenContent)) {  // 'binary' | 'hex1' | 'hex2' | 'number'
        if ((/^[a-d]h$/i.test(tokenContent))) {  // register ah, bh, ch, dh has priority over ah, bh... hex values
            return 'register'
        }
        else {
            return 'numeric'
        }
    }
    else if (/^[a-z0-9_]+$/i.test(tokenContent)) {
        if (allIntelRegisters.includes(tokenContent.toLowerCase())) {
            return 'register'
        }
        else if (allIntelOpcodes.includes(tokenContent.toLowerCase())) {
            return 'opcode'
        }
        else {
            return 'alphanumeric'
        }
    }
    else if (/^'.'$/i.test(tokenContent)) {  // char is number too :)  // TODO: validate if char is ascii in validator
        return 'numeric'
    }
    else if (/^[+*/-]$/i.test(tokenContent)) {
        return 'operator'
    }
    else if (/^;.*\r?$/i.test(tokenContent)) {
        return 'comment'
    }
    else {
        if (tokenContent.length !== 1) {
            throw `token '${tokenContent}' doesn't have length 1`  // this should never happen
        }
        else {
            return 'identifier'
        }
    }
}

/**
 * Detects if token is 8bit, 16-bit or can't be determined
 */
function getBitSize(tokenType: tTokenType, tokenContent: string): tTokenBits {
    if (tokenType === "type_override" && tokenContent === "word ptr") {
        return 16
    }
    else if (tokenType === "type_override" && tokenContent === "byte ptr") {
        return 8
    }
    else if (tokenType === "numeric" && /^((0b[01]{16})|(0x[0-9a-f]{4})|([0-9a-f]{4}h))$/i.test(tokenContent)) {  // only 16-bit numeric values
        return 16
    }
    else if (tokenType === "numeric" && /^((0b[01]{8})|(0x[0-9a-f]{2})|([0-9a-f]{2}h)|'[\x00-\x7F]')$/i.test(tokenContent)) {  // only 8-bit numeric values, including ascii-only chars
        return 8
    }
    else if (tokenType === "register" && allIntel16bitRegisters.includes(tokenContent)){
        return 16
    }
    else if (tokenType === "register" && allIntel8bitRegisters.includes(tokenContent)){
        return 8
    }
    else {
        return null
    }
}

/**
 * Tokenizes instruction string
 * inspired by and modified https://levelup.gitconnected.com/create-your-own-expression-parser-d1f622077796
 */
export function tokenize(instructionList: string): iToken[] {
    instructionList = instructionList.toLowerCase()  // convert everything to lowercase
    let rowNumber = 0
    let colOffset = 0
    let tokenList: iToken[] = []

    /*
    tokens can be:
    regex           explanation                                             example
    -----           -----------                                             -----------
    (word|byte) ptr 16-bit or 8-bit memory access                           word ptr
    0b[01]+         binary first variant                                    0b01000101
    [01]+b          binary second variant                                   01000101b
    0x[0-9a-f]+     hex first variant                                       0xb800
    [0-9a-f]+h      hex second variant                                      b800h
    -?[0-9]+        decimal number, including negative values               -5
    [a-z0-9_]+      any alphanumeric word                                   labelWithNumbers123
    '.'             one literal character                                   'c'
    ;[^\n]*         comment                                                 ; this is a comment that should be ignored
    \n              new line                                                new lines are used to count rows
    \S              if no match found, match next non empty character       *

    regex is case insensitive (i option)
     */
    const reToken = /(word|byte) ptr|0b[01]+|[01]+b|0x[0-9a-f]+|[0-9a-f]+h|-?[0-9]+|[a-z0-9_]+|'.'|;[^\n]*|\n|\S/ig
    // const reToken = /[0-9]+(\.[0-9]*)?([eE][\+\-]?[0-9]+)?|[A-Za-z_][A-Za-z_0-9]*|\S/g;
    while(true) {
        const match = reToken.exec(instructionList)
        if (match === null) {
            break
        }

        let tokenContent = match[0]


        if (tokenContent == '\n'){  // each new line, rowNumber is incremented
            rowNumber++
            colOffset = match.index + 1
        }
        else {
            let tokenType = getTokenType(tokenContent)
            let bitSize = getBitSize(tokenType, tokenContent)
            let token: iToken = {
                row: rowNumber,
                col: match.index - colOffset,
                index: match.index,
                content: tokenContent,
                type: tokenType,
                bits: bitSize,
                value: (tokenType === 'numeric') ? autodetectToSignedInteger(tokenContent) : null
            }

            if (token.type !== 'comment') {  // ignore comments
                tokenList.push(token)
                // console.log(token)
            }
        }
    }

    // console.log("tokenList", JSON.stringify(tokenList))
    return tokenList
}
