import {opcodes} from "./opcodes"
import {registers} from "@stores/stores"
import {get, writable} from "svelte/store"
import type {tRegister} from "../types/types"
import { memory } from "@stores/stores"
import {errorObject} from "./createParseTree";
import {signedToUnsignedInt} from "../formatConverter";

class executedLineToEditorLine {
    private mapping: {}

    constructor() {
        this.mapping = {}
    }

    updateRows(rows: iRow[]) {
        this.mapping = {}
        let counter = 0

        for (const row of rows) {
            if (row.type === 'instruction') {
                this.mapping[counter] = row.opcode.row
                counter++
            }
        }

        currentlyExecutedLine.set(eLineToEditorLine.convert(get(registers).ip))
    }

    convert(ipRegister: number) {
        return this.mapping?.[ipRegister] ?? -1
    }
}

let eLineToEditorLine = new executedLineToEditorLine()
export const currentlyExecutedLine = writable(-1);

registers.subscribe(updatedRegisters => {
    currentlyExecutedLine.set(eLineToEditorLine.convert(updatedRegisters.ip))
})



function prepareOperand(operand: iOperand, bits: tTokenBits, segment: tSegment): iCompiledOperand {
    if (operand.type === 'register') {
        const registerName = <tRegister>operand.tokens[0].content
        return {
            get: (): number => registers.get(<tRegister>registerName),
            set: (valueToSet: number): void => {
                registers.set(<tRegister>registerName, valueToSet)
            },
            setWithFlags: (valueToSet: number): void => {
                registers.setWithFlags(<tRegister>registerName, valueToSet)
            },
            type: "register"
        }
    }
    else if (operand.type === 'immediate'){
        let value = operand.tokens[0].value
        return {
            get: (): number => value,
            set: (valueToSet: number): void => {
                throw "ERROR: you can't write to immediate!"
                // console.error("prepareLocation - you can't write to immediate!")
            },
            setWithFlags: (valueToSet: number): void => {
                throw "ERROR: you can't write to immediate!"
                // console.error("prepareLocation - you can't write to immediate!")
            },
            type: "immediate"
        }
    }
    else if (operand.type === 'memory'){
        let computeAddressFunctions: { (): number } [] = []

        let slicedOperandTokens = operand.tokens.slice(1, -1)
        let sign = 1

        for (const token of slicedOperandTokens) {
            if (token.type === 'operator') {
                if (token.content === '+') {
                    sign = 1
                } else if (token.content === '-') {
                    sign = -1
                }
                else {  // TODO: move to validator
                    throw errorObject(token, "Operator can be only + or -")
                }
            }
            else if (token.type === 'register') {
                let localSign = sign
                computeAddressFunctions.push((): number => {
                    // console.log("sign", localSign, "register", token.content)
                    return localSign * signedToUnsignedInt(registers.get(<tRegister>token.content), 16)
                })
            }
            else if (token.type === 'numeric') {
                let localSign = sign
                let localValue = token.value
                computeAddressFunctions.push((): number => {
                    // console.log("sign", localSign, "numeric token.content", token.content)
                    return localSign * localValue  // TODO: convert hex, binary
                })
            }
        }


        function getAddress() {
            let address: number = signedToUnsignedInt(registers.get(<tRegister>segment), 16) << 4
            for (const addressFunction of computeAddressFunctions) {
                address += addressFunction()
            }
            return signedToUnsignedInt(address, 20)
        }
        return {
            get: (): number => {
                return memory.get(getAddress(), bits)
            },
            set: (valueToSet: number): void => {
                memory.set(getAddress(), valueToSet, bits)
            },
            setWithFlags: (valueToSet: number): void => {
                memory.setWithFlags(getAddress(), valueToSet, bits)
            },
            type: "memory"
        }
    }
}

function compile(instruction: iInstruction, labels: { [labelName: string]: number }): () => void {
    let opcode = opcodes[instruction.opcode.content]

    if (instruction.operands?.[0]?.type === 'label') {  // jump
        let labelAddress = labels[instruction.operands[0].tokens[0].content]

        if (typeof labelAddress === 'undefined') {  // TODO: move to validation
            throw `Label, where we need to jump doesn't exists ${instruction.operands[0].tokens[0].content}`
        }

        return function run(): void {
            let labelObj = {
                get: ()=> labelAddress
            }
            opcode.run(labelObj)
        }
    }
    else {
        // prepare operands during "compilation", so it doesn't slow down execution
        let preparedOperands = instruction.operands.map(operand => prepareOperand(operand, instruction.bits, instruction.segment))
        return function run(): void {
            opcode.run(...preparedOperands)
            registers.inc('ip')  // change for jumps
        }
    }
}


function parseLabels(rows: iRow[]): {[labelName: string]: number} {
    // TODO: validate in validator, if duplicate labels exist, or if someone tries to jump to non-existing label
    let labels: {[labelName: string]: number} = {}  // key is label name, value is address of instruction, where label belongs
    let rowCounter = rows.filter(row => row.type === 'instruction').length  // amount of instructions in compiled code
    const reversedRows: iRow[] = [...rows].reverse()
    for (const row of reversedRows) {
        if (row.type === 'label') {
            let labelName = row.token.content
            labels[labelName] = rowCounter
        }
        else {
            rowCounter--
        }
    }
    return labels
}


/**
 * TODO: add types to opcodes object
 *
 * TODO: in validateParseTree:
 * check if opcode is valid / implemented
 * if operator + any + operator + ... in operand field
 */
export function compileParseTree(rows: iRow[], pass:number=0): [iCompiledInstruction[], iError[]] {
    let errors: iError[] = []

    eLineToEditorLine.updateRows(rows)

    if (rows.length === 0) { // nothing left to compile
        return [[], []]
    }

    const labels = parseLabels(rows)


    let compiledInstructions: iCompiledInstruction[] = []

    for (const row of rows) {
        if (row.type === "instruction") {
            let opcode = row.opcode
            try {
                let compiledInstruction: iCompiledInstruction = {
                    instruction: row,
                    run: compile(row, labels)
                }

                compiledInstructions.push(compiledInstruction)
            }
            catch (e) {

                // there is a row that causes unexpected compilation error.
                // Try to compile again with that problematic row removed. It may be successful and at least part of the code may be executable
                // uses recursion - recursively remove rows until leftover rows are removed or no rows are left

                let problematicRowNumber = row.operands[0].tokens[0].row
                console.error("compiler crashed while compiling. This should be ideally moved to validation. Details:" + JSON.stringify(e), problematicRowNumber)

                const [compiledInstructionsRepaired, moreErrors] = compileParseTree(rows.filter((row:iRow) => {
                    if ("position" in row) {
                        return row.position.row !== problematicRowNumber
                    }
                    else {  // should never happen
                        console.error("compileParseTree - unexpected row:", row)
                        return false
                    }
                }), pass + 1)

                errors.push({
                    message: "compilation error on this line (pass/attempt: " + pass + ").\nCompiler will try to compile your code without this line included.\nTechnical details:\n" + JSON.stringify(e),
                    token: row.operands[0].tokens[0],
                    type: 'error'
                })
                return [compiledInstructionsRepaired, [...errors, ...moreErrors]]
            }

        }
    }

    console.log("newCompiledInstructions", compiledInstructions)

    currentlyExecutedLine.set(eLineToEditorLine.convert(get(registers).ip))

    // if (compiledInstructions.length > 0)
    //     compiledInstructions[0].run().then(r => console.log(r))

    return [compiledInstructions, errors]



}
