import {parseInstructionList} from "./parseInstruction"

export const getErrors = (instructionToParse) => {
    let [instructions, errors] = parseInstructionList(instructionToParse)
    return errors
}
