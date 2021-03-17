import {opcodes} from "./opcodes"
import {registers} from "../stores/registers"
import {readable, writable} from "svelte/store"
import type {tRegister} from "../types/types"

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



function prepareOperand(operand: iOperand): iCompiledOperand {
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
}

function compile(instruction: iInstruction, labels: { [labelName: string]: number }): () => Promise<void> {
    let opcode = opcodes[instruction.opcode.content]

    if (instruction.operands?.[0]?.type === 'label') {  // jump
        console.warn("Jumps not implemented, but used")

        let labelAddress = labels[instruction.operands[0].tokens[0].content]

        return function run(): Promise<void> {
            return new Promise((resolve, reject) => {
                let labelObj = {
                    get: ()=> labelAddress
                }
                opcode.run(labelObj)
                resolve()
            });
        }
    }
    else {
        // prepare operands during "compilation", so it doesn't slow down execution
        let preparedOperands = instruction.operands.map(operand => prepareOperand(operand))
        return function run(): Promise<void> {
            return new Promise((resolve, reject) => {
                opcode.run(...preparedOperands)
                registers.inc('ip')  // change for jumps
                resolve()
            });
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
export function compileParseTree(rows: iRow[]): iCompiledInstruction[] {
    if (rows.length === 0) {
        return []
    }

    const labels = parseLabels(rows)

    eLineToEditorLine.updateRows(rows)

    let compiledInstructions: iCompiledInstruction[] = []

    for (const row of rows) {
        if (row.type === "instruction") {
            let opcode = row.opcode

            let compiledInstruction: iCompiledInstruction = {
                instruction: row,
                run: compile(row, labels)
            }

            compiledInstructions.push(compiledInstruction)

            console.log("opcode", opcodes[opcode.content])
        }
    }

    console.log("newCompiledInstructions", compiledInstructions)

    // if (compiledInstructions.length > 0)
    //     compiledInstructions[0].run().then(r => console.log(r))

    return compiledInstructions



}
