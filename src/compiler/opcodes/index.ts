// to add new instruction:
// 1) implement it - use already implemented instructions as a inspiration
// 2) import it here
// 3) add it to opcodes object

// If rollup throws error after adding new .ts file, restart it
import {registers, memory} from "../../stores/stores";

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
import jmp from "./jmp";


export const jumps = {

}

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
    pop,
    jmp
}

export const opcodes_0_operands = []
export const opcodes_1_operands = []
export const opcodes_2_operands = []

Object.entries(opcodes).map(entry => {
    let [opcodeName, opcodeContent] = entry

    if (opcodeContent.run.length === 0) {
        opcodes_0_operands.push(opcodeName)
    }
    else if (opcodeContent.run.length === 1) {
        opcodes_1_operands.push(opcodeName)
    }
    else if (opcodeContent.run.length === 2) {
        opcodes_2_operands.push(opcodeName)
    }
})
