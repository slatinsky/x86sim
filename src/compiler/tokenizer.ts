import {allIntelOpcodes, allIntelRegisters} from "../config"
type tTokenType = 'numeric' | 'alphanumeric' | 'operator' | 'register' | 'opcode' |'literalCharacter' | 'identifier'

interface iToken {
    row: number,
    col: number,
    index: number,  // character index from the beginning
    type: tTokenType,
    content: string
}

function getTokenType(tokenContent: string): tTokenType {
    if (/^0b[01]+|0x[0-9a-f]|[0-9a-f]h|[0-9]$/i.test(tokenContent)) {  // 'binary' | 'hex1' | 'hex2' | 'number'
        return 'numeric'
    }
    else if (/^[a-z0-9]+$/i.test(tokenContent)) {
        if (allIntelRegisters.includes(tokenContent)) {
            return 'register'
        }
        else if (allIntelOpcodes.includes(tokenContent)) {
            return 'opcode'
        }
        else {
            return 'alphanumeric'
        }
    }
    else if (/^'.'$/i.test(tokenContent)) {
        return 'literalCharacter'
    }
    else if (/^[+*/-]$/i.test(tokenContent)) {
        return 'operator'
    }
    else {
        if (tokenContent.length !== 1) {
            throw `token '${tokenContent}' doesn't have length 1`
        }
        else {
            return 'identifier'
        }
    }
}

/**
 * Tokenizes instruction string
 * inspired by and modified https://levelup.gitconnected.com/create-your-own-expression-parser-d1f622077796
 */
export function tokenize(instructionList: string): iToken[] {
    let rowNumber = 0
    let colOffset = 0
    let nextTokenIndex = 0
    let tokenList: iToken[] = []


    /*
    tokens can be:
    regex           explanation                                             example
    -----           -----------                                             -----------
    0b[01]+         binary                                                  0b01000101
    0x[0-9a-f]      hex first variant                                       0xb800
    [0-9a-f]h       hex second variant                                      b800h
    [a-z0-9]+       any alphanumeric word                                   labelWithNumbers123
    '.'             one literal character                                   'c'
    \n              new line
    \S              if no match found, match next non empty character

    regex is case insensitive (i option)
     */
    const reToken = /0b[01]+|0x[0-9a-f]|[0-9a-f]h|[a-z0-9]+|'.'|\n|\S/ig
    // const reToken = /[0-9]+(\.[0-9]*)?([eE][\+\-]?[0-9]+)?|[A-Za-z_][A-Za-z_0-9]*|\S/g;
    while(true) {
        const match = reToken.exec(instructionList)
        if (match === null) {
            break
        }

        // if new line
        if (match[0] == '\n'){
            rowNumber++
            colOffset = match.index
        }
        else {
            let token: iToken = {
                row: rowNumber,
                col: match.index - colOffset,
                index: match.index,
                content: match[0],
                type: getTokenType(match[0])
            }

            tokenList.push(token)
            console.log(token)
        }
    }

    console.log(tokenList)
    return tokenList
}
