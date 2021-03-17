/**
 * merges two tokens together, so they can be used as one token
 */
function mergeTwoTokens(token1: iToken, token2: iToken): iToken {
    let newToken: iToken = {
        row: token1.row,
        col: token1.col,
        index: token1.index,  // character index from the beginning
        type: token1.type === token2.type ? token1.type : 'mixed',
        content: token1.content + ''.padStart(token2.index - token1.index + token1.content.length + token1.content.length, ' ') + token2.content   // pad content of in-between tokens with spaces
    }

    return newToken
}

/**
 * Merges array of tokens together
 * If no token supplied, returns empty token
 */
export function mergeTokens(tokens: iToken[]): iToken {
    if (tokens.length === 0) {
        return {
            row: 0,
            col: 0,
            index: 0,
            type: 'mixed',
            content: ''
        }
    }

    let tokensCopy: iToken[] = [...tokens]

    let mergedToken = tokensCopy.shift()
    for (const token of tokensCopy) {
        mergedToken = mergeTwoTokens(mergedToken, token)
    }

    return mergedToken
}

export function errorObject(token: iToken, message: string, type: tErrorType = 'error'): iError {
    return {
        message,
        token,
        type
    }
}

/**
 *  Groups neighboring tokens, for which groupBy function returns the same value
 */
function groupNeighbours(tokens: iToken[], groupBy: (token: iToken) => number): iToken[][] {
    if (tokens.length === 0) {
        return []
    }

    let splitTokens: iToken[][] = []
    let currentTokenGroup: iToken[] = []
    let lastInsertedToken = tokens[0]
    for (const token of tokens) {
        if (groupBy(lastInsertedToken) !== groupBy(token)) {
            // this token is not from the same group as token inserted before
            // create new group

            if (currentTokenGroup.length > 0) {
                splitTokens.push(currentTokenGroup)  // push current group content
            }
            currentTokenGroup = []                   // new group
        }

        currentTokenGroup.push(token)
        lastInsertedToken = token
    }

    if (currentTokenGroup.length > 0) {
        splitTokens.push(currentTokenGroup)
    }
    return splitTokens
}




/**
 * splits tokens to groups based on a separator token
 * removes separator token that separates those groups
 *
 * as input expects:
 * - tokens array
 * - function that tells if input token is separator token
 */
function splitTokensBy(tokens: iToken[], isTokenSeparator: (token: iToken) => boolean): iToken[][] {
    let splitTokens: iToken[][] = []
    let currentTokenGroup: iToken[] = []
    for (const token of tokens) {
        if (isTokenSeparator(token)) {
            if (currentTokenGroup.length > 0) {
                splitTokens.push(currentTokenGroup)
            }
            currentTokenGroup = []
        }
        else {
            currentTokenGroup.push(token)
        }
    }
    if (currentTokenGroup.length > 0) {
        splitTokens.push(currentTokenGroup)
    }
    return splitTokens
}

/**
 * wrapper to split tokens by identifier
 */
function splitTokensByIdentifier(tokens: iToken[], identifierContent: string): iToken[][] {
    return splitTokensBy(tokens, (token: iToken): boolean => {
        return token.type === 'identifier' && token.content === identifierContent
    })
}



function nextToken(tokens: iToken[]): iToken {
    return tokens.shift();
}

/**
 * parses one operand and sets its type
 * at least one token inside operandTokens is expected to always be supplied to this function
 *
 */
function parseOperand(operandTokens: iToken[]): iOperand {
    if (operandTokens.length === 0) {
        throw "no operands supplied to parseOperand function, you should never see this error"
    }

    // console.log("parseOperand", operandTokens)
    // type iOperand = {
    //     type: 'immediate' | 'register' | 'memory' | 'label'
    //     tokens: iToken[]
    // }

    let type

    if (operandTokens[0].content === '[' && operandTokens[operandTokens.length - 1].content === ']') {
        // operandTokens = operandTokens.slice(1, -1)
        type = 'memory'
    }
    else if (operandTokens[0].content === '[') {
        throw errorObject(operandTokens[0], "Missing closing bracket ']'")
    }
    else if (operandTokens[operandTokens.length - 1].content === ']') {
        throw errorObject(operandTokens[operandTokens.length - 1], "Missing opening bracket '['")
    }
    else if (operandTokens[0].type === 'numeric') {
        type = 'immediate'
    }
    else if (operandTokens[0].type === 'register') {
        type = 'register'
    }
    else if (operandTokens[0].type === 'alphanumeric') {
        type = 'label'
    }
    else {
        throw `can't parse operand '${JSON.stringify(operandTokens)}' (1)`
    }

    // check common errors
    // if (operandTokens.find(token => token.content === '[' || token.content === ']')) {
    //     let invalidToken = operandTokens.find(token => token.content === '[' || token.content === ']')
    //     throw errorObject(invalidToken, `Invalid use of '${invalidToken.content}'`)
    // }

    return {
        type: type,
        tokens: operandTokens
    }
}

function splitOperands(tokens: iToken[]): iToken[][] {
    return splitTokensByIdentifier(tokens, ',')
}

/**
 * parseRow will always get one or more tokens
 */
function parseRow(tokens: iToken[]): iRow {
    if (tokens?.[1]?.content === ',') {
        throw errorObject(tokens[1], "Replace comma with space")    // for example mov,ax,bx -> mov ax,bx
    }
    if (tokens.length === 2 && tokens[0].type === 'alphanumeric' && tokens[1].content === ':') {
        return {
            type: "label",
            token: tokens[0],
        }
    }
    else if (tokens.length >= 1 && tokens[0].type === 'opcode') {
        let opcodeToken = nextToken(tokens)
        let instruction: iInstruction = {

            type: 'instruction',
            opcode: opcodeToken,
            operands: [],
        }

        let tokensSplitByOperands = splitOperands(tokens)
        for (const operandTokens of tokensSplitByOperands) {
            instruction.operands.push(parseOperand(operandTokens))
        }
        return instruction
    }
    else if (tokens.length >= 1 && tokens[0].type !== 'opcode') {
        throw errorObject(tokens[0], `'${tokens[0].content}' isn't valid opcode`)
    }
    else {
        throw "you should never see this message, because parseRow should always receive one or more tokens - you should never see this error"
    }
}


export function createParseTree(tokens: iToken[]): [iRow[], iError[]] {

    let tokensGroupedByRow: iToken[][] = groupNeighbours(tokens, (token: iToken): number => token.row)
    console.log("rowsNew", tokensGroupedByRow)

    let rows: iRow[] = []
    let errors: iError[] = []

    for (const tokensRow of tokensGroupedByRow) {
        try {
            rows.push(parseRow(tokensRow))
        }
        catch (e) {
            console.error("line:", tokensRow?.[0].row, e)
            errors.push(e)
        }
    }

    console.log("createParseTree", rows)
    return [rows, errors]
}