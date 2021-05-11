import {errorObject, mergeTokens} from "@compiler/createParseTree";
import {allIntelSegmentRegisters} from "../config";
import {opcodes} from "../stores/stores";

/**
 * merges all tokens from operands, so they can be used in error highlighting
 * @param operands
 */
function mergeOperandsTokens(operands: iOperand[]): iToken {
    return mergeTokens(operands.map(operand => operand.tokens).flat())
}

function validateOperand(operand: iOperand): void {
    if (operand.type === 'memory') {
        for (const token of operand.tokens) {

            if (token.type === 'register' && !['bx','si','si','sp','bp','ip'].includes(token.content.toLowerCase())) {  // is token one of allowed registers during memory access?
                // example: mov [ax], 5      is invalid
                throw errorObject(token, `ERROR: only registers bx, si, si, sp, bp, ip and immediate values\ncan be used during memory access,\nyou used '${token.content}'`)
            }
        }
    }
}

function validateWriteToSegmentRegister(row: iInstruction) {
    // https://stackoverflow.com/questions/19074666/8086-why-cant-we-move-an-immediate-data-into-segment-register
    if (row.operands.length === 2) {

        let segmentRegister
        let otherOperand
        if (row.operands[0].type === "register" && row.operands[1].type !== "register") {
            let firstRegisterName = row.operands[0].tokens[0].content.toLowerCase()
            if (allIntelSegmentRegisters.includes(firstRegisterName)) {
                // example: mov ds, [0]

                segmentRegister = firstRegisterName
                otherOperand = mergeTokens(row.operands[1].tokens)

                let generatedHint = `push ax
mov ax, ${otherOperand.content}
${row.opcode.content} ${segmentRegister}, ax
pop ax`
                throw errorObject(otherOperand, `Write to segment registers can be done using only general purpose register:\n\nPossible solution:\n${generatedHint}`)
            }
        }
        else if (row.operands[0].type !== "register" && row.operands[1].type === "register") {
            let secondRegisterName = row.operands[1].tokens[0].content.toLowerCase()
            if (allIntelSegmentRegisters.includes(secondRegisterName)) {
                // example: mov [0], ds

                segmentRegister = secondRegisterName
                otherOperand = mergeTokens(row.operands[0].tokens)

                let generatedHint = `push ax
mov ax, ${segmentRegister}
${row.opcode.content} ${otherOperand.content}, ax
pop ax`
                throw errorObject(otherOperand, `Read from segment registers can be done using only general purpose register:\n\nPossible solution:\n${generatedHint}`)
            }
        }

        if (row.operands[0].type === "register" && row.operands[1].type === "register" &&
            allIntelSegmentRegisters.includes(row.operands[0].tokens[0].content.toLowerCase()) &&
            allIntelSegmentRegisters.includes(row.operands[1].tokens[0].content.toLowerCase())) {
            // example: add cs, ds

            let generatedHint = `push ax
mov ax, ${row.operands[0].tokens[0].content}
${row.opcode.content} ${row.operands[1].tokens[0].content}, ax
pop ax`
            throw errorObject(mergeOperandsTokens(row.operands), `Cannot use two segment registers in the same instruction:\n\nPossible solution:\n${generatedHint}`)
        }
    }
}

function validateRow(row: iRow) {
    if (row.type === 'instruction') {
        if (!opcodes.hasOwnProperty(row.opcode.content)) {
            throw errorObject(row.opcode, `Opcode '${row.opcode.content}' isn't implemented by this simulator.\nAvailable opcodes: ${Object.keys(opcodes).sort().join(', ')}`)  // tokenizer says, it is valid intel opcode, just we don't have it implemented
        }

        let operandAmountRequired = opcodes[row.opcode.content].run.length
        let operandAmountProvided = row.operands.length

        if (opcodes[row.opcode.content].run.length !== row.operands.length) {
            // validate amount of operands
            throw errorObject(row.operands.length > 0 ? mergeOperandsTokens(row.operands) : row.opcode, `ERROR: instruction '${row.opcode.content}' has incorrect amount of operands: ${operandAmountRequired} required, but ${operandAmountProvided} provided`)
        }
        else if (row.operands.length === 2 && row.operands[0].type === "memory" && row.operands[1].type === "memory") {
            // generate hint, if user tries to access two memory locations at the same time (example: mov [bx], [bx+2])
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
${row.opcode.content} ${operand1}, ${tempRegisterName}
pop ${tempRegisterName}`

            throw errorObject(mergeOperandsTokens(row.operands), `Intel processor can't access two memory places in the same instruction:\n\nPossible solution:\n${generatedHint}`)
        }
        validateWriteToSegmentRegister(row)

        for (const operand of row.operands) {
            validateOperand(operand)
        }
    }
}

/**
 * Validates parse tree
 * and removes invalid rows before compilation
 * @param rows
 */
export function validateParseTree(rows: iRow[]): [iError[], iRow[]] {
    let errors: iError[] = []
    for (const row of rows) {
        try {
            validateRow(row)
        }
        catch (e) {
            console.error("line:", row, e)
            errors.push(e)
        }
    }


    // remove invalid rows from parse tree
    let errorRows = errors.map(error => error.token.row)
    rows = rows.filter(row => !errorRows.includes(row.position.row))
    return [errors, rows]
}
