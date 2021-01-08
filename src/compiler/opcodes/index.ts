// to add new instruction:
// 1) implement it - use already implemented instructions as a inspiration
// 2) import it here
// 3) add it to opcodes object

// If rollup throws error after adding new .ts file, restart it

import add from "./add"
import sub from "./sub"
import mov from "./mov"
import mul from "./mul"
import xor from "./xor"
import nop from "./nop"
import inc from "./inc";
import dec from "./dec";
import push from "./push";
import pop from "./pop";

export const opcodes = {
    add,
    sub,
    mov,
    mul,
    xor,
    nop,
    inc,
    dec,
    push,
    pop
}

// if opcode is implemented is validated during parsing - it doesn't need to be checked here
const executeInstruction = (opcode: string, operands) => {
    opcodes[opcode].run(...operands)
}

// temporary function to execute list of instructions
// doesn't support jumps
export const executeInstructionList = (instructionList) => {
    instructionList.map(instruction => executeInstruction(instruction.parsed.opcode, instruction.parsed.operands))
}
