import {opcodes} from "./opcodes";

/**
 * TODO: add types to opcodes object
 *
 * TODO: in validateParseTree:
 * check if opcode is valid / implemented
 * if operator + any + operator + ... in operand field
 */
export function compileParseTree(rows: iRow[]) {
    for (const row of rows) {
        if (row.type === "instruction") {
            let opcode = row.opcode
            let neededOperands = opcodes[opcode.content].run.length

            console.log("opcode", opcodes[opcode.content])
        }
    }


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
