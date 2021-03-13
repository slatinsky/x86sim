import ret from "./opcodes/ret";

function nextToken(tokens: iToken[]): iToken {
    return tokens.shift();
}

function parseOperand(operandTokens: iToken[]): iOperand {
    console.log("parseOperand", operandTokens)

    let type

    // {
    //     type: 'immediate' | 'register' | 'memory' | 'label'
    //     tokens: iToken[]
    // }

    if (operandTokens.length === 1) {
        if (operandTokens[0].type === 'numeric') {
            type = 'immediate'
        }
        else if (operandTokens[0].type === 'register') {
            type = 'register'
        }
        else if (operandTokens[0].type === 'alphanumeric') {
            type = 'label'
        }
    }
    else if (operandTokens.length > 1) {
        if (operandTokens[0].content === ',') {
            throw "replace first comma with space"          // for example mov,ax,bx -> mov ax,bx
        }
        if (operandTokens[0].content === '[' && operandTokens[operandTokens.length - 1].content === ']') {
            operandTokens = operandTokens.slice(1, -1)
            type = 'label'
        }
        else {
            throw `can't parse operand '${JSON.stringify(operandTokens)}' (1)`
        }
    }
    else {
        throw `can't parse operand '${JSON.stringify(operandTokens)}' (2)`
    }

    return {
        type: type,
        tokens: operandTokens
    }
}

function splitOperands(tokens: iToken[]): iToken[][] {
    let output = []
    let operandTokens = []
    let token: iToken
    while (token = nextToken(tokens)) {   // split tokens to rows and execute parseRow for each row
        if (token.type === "identifier" && token.content === ',' && operandTokens.length > 0) {
            output.push(operandTokens)
            operandTokens = []
        }
        else {
            operandTokens.push(token)
        }
    }

    if (operandTokens.length > 0) {
        output.push(operandTokens)
    }

    return output
}

function parseRow(tokens: iToken[]): iRow {
    if (tokens.length === 2 && tokens[0].type === 'alphanumeric' && tokens[1].type === 'identifier' && tokens[1].content === ':') {
        return {
            type: "label",
            name: tokens[0].content,
            row: tokens[0].row,
            col: tokens[0].col,
            index: tokens[0].index,
        }
    }
    else if (tokens.length >= 1 && tokens[0].type === 'opcode') {
        let opcodeToken = nextToken(tokens)
        let instruction: iInstruction = {

            type: 'instruction',
            opcode: opcodeToken.content,
            operands: [],
            row: opcodeToken.row,
            col: opcodeToken.col,
            index: opcodeToken.index,
        }

        let tokensSplitByOperands = splitOperands(tokens)
        for (const operandTokens of tokensSplitByOperands) {
            instruction.operands.push(parseOperand(operandTokens))
        }
        return instruction
        //
        // let type = 'immediate'
        // let operand: iOperand = {
        //     type: '',
        //     tokens: []
        // }
        //
        // for (const token of tokens.slice(1)) {
        //     if (token.type === 'identifier' && token.content === ',' && operand.tokens.length > 0)
        //     operand.tokens.push()
        // }
        // return {
        //     type: 'instruction',
        //     opcode: tokens[0].content,
        //     operands: []
        // }
    }
}


export function createParseTree(tokens: iToken[]): iRow[] {
    if (tokens.length === 0) {
        return []
    }

    let rows: iRow[] = []

    let currentRow: number = tokens?.[0].row ?? 0
    let currentRowTokens: iToken[] = []

    let token
    while (token = nextToken(tokens)) {   // split tokens to rows and execute parseRow for each row
        if (token.row !== currentRow) {
            try {
                rows.push(parseRow(currentRowTokens))
            }
            catch (e) {
                console.error(e)
            }
            currentRow = token.row
            currentRowTokens = []
        }

        currentRowTokens.push(token)
    }

    if (currentRowTokens.length !== 0) {  // handle last row
        try {
            rows.push(parseRow(currentRowTokens))
        }
        catch (e) {
            console.error(e)
        }

    }

    console.log("createParseTree", rows)
}
