import {registers} from "../stores/stores";
import {parseInstructionList} from "./parseInstruction"
import {executeInstructionList} from "./opcodes"

export const step = (instructionToParse) => {

}

export const getErrors = (instructionToParse) => {
    let [instructions, errors] = parseInstructionList(instructionToParse)
    return errors
}

export const runAll = (alInstructions: string) => {

    let [instructions, errors] = parseInstructionList(alInstructions)

    // registers.reset()
    try {
        executeInstructionList(instructions)
        return instructions
    }
    catch (e) {
        throw e
    }

    // registers.set('bx', 2)
}
