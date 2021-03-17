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

function compile(instruction: iInstruction): () => Promise<void> {
    let opcode = opcodes[instruction.opcode.content]

    if (instruction.operands?.[0]?.type === 'label') {  // jump
        console.log("Jumps not implemented")
        return function run(): Promise<void> {
            return new Promise((resolve, reject) => {
                let labelObj = {
                    get: ()=> 3   // SET HERE absolute label address
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


/**
 * TODO: add types to opcodes object
 *
 * TODO: in validateParseTree:
 * check if opcode is valid / implemented
 * if operator + any + operator + ... in operand field
 */
export function compileParseTree(rows: iRow[]): iCompiledInstruction[] {

    eLineToEditorLine.updateRows(rows)

    let compiledInstructions: iCompiledInstruction[] = []

    for (const row of rows) {
        if (row.type === "instruction") {
            let opcode = row.opcode

            let compiledInstruction: iCompiledInstruction = {
                instruction: row,
                run: compile(row)
            }

            compiledInstructions.push(compiledInstruction)

            console.log("opcode", opcodes[opcode.content])
        }
    }

    console.log("newCompiledInstructions", compiledInstructions)

    // if (compiledInstructions.length > 0)
    //     compiledInstructions[0].run().then(r => console.log(r))

    return compiledInstructions

    // TODO: parse label addresses firsts
    // let labels = []
    // const reversedRows: iRow[] = [...rows].reverse()

    // let lastInstructionRow = reversedRows?.[0].row ?? 0
    // for (const row of reversedRows) {
    //     if (row.type === 'label') {
    //
    //     }
    //     else {
    //         lastInstructionRow = row.row
    //     }
    //
    // }

}
