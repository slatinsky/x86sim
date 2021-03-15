import {errorObject} from "./createParseTree";

function validateRow(row: iRow) {
    if (row.type === 'instruction') {
        if (row.operands.length > 2) {
            throw errorObject(row.operands[2].tokens[0], "More than 2 operands are not supported by any intel instruction")
        }
        else if (row.operands.length === 2 && row.operands[0].type === "memory" && row.operands[1].type === "memory") {
            let operand1 = row.operands[0].tokens.map(token => token.content).join('')
            let operand2 = row.operands[1].tokens.map(token => token.content).join('')

            // TODO: this can be 100% simplified
            let tempRegisterName = 'ax'
            if (operand1.includes('ax') || operand2.includes('ax')) {
                tempRegisterName = 'bx'
                if (operand1.includes('bx') || operand2.includes('bx')) {
                    tempRegisterName = 'cx'
                    if (operand1.includes('cx') || operand2.includes('cx')) {
                        tempRegisterName = 'dx'
                    }
                }
            }

            let generatedHint = `push ${tempRegisterName}
mov ${tempRegisterName}, ${operand2}
${row.opcode} ${operand1}, ${tempRegisterName}
pop ${tempRegisterName}`

            throw errorObject(row.operands[0].tokens[0], `Intel processor can't access two memory places in the same instruction:\n\nPossible solution:\n${generatedHint}`)}
    }
}

/**
 * Will validate parse tree
 * @param rows
 */
export function validateParseTree(rows: iRow[]): iError[] {
    let errors: iError[] = []
    for (const row of rows) {
        try {
            validateRow(row)
        }
        catch (e) {
            console.error("line:", row.row, e)
            errors.push(e)
        }

    }
    return errors
}
