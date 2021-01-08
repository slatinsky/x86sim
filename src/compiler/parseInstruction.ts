import {registers} from "../stores/stores";
import {opcodes} from "./opcodes";
import type {register} from "../types/types";

interface Operand {
    get(): number,

    set(valueToSet: number): void,

    type: "immediate" | "register" | "memory";
}

interface PreparedOperand {
    operand: string,
    index: number
}

interface PreparedInstruction {
    label?: string,
    opcode?: string,
    operands?: Operand[]
}

function cleanupWhitespaceAndComments(instruction: string): string {
    /*
    Change tabs to spaces
    Also replaces multiple continuous whitespace characters to one space
     */
    instruction.replace(/[ \t]+/g, ' ');

    /*
    trim whitespace from the beginning and the end
    before
    '    mov    ax    ,   bx    '

    after
    'mov    ax    ,   bx'
    */
    instruction = instruction.trim()

    /*
    delete comments (text after ; character)
    [ ' *'   match whitespace before character ;
    ;.*$     delete everything after charracter ;, including ;

    before
    'mov ax, bx  ; this is a comment'

    after
    'mov ax, bx'
    */
    instruction = instruction.replace(/ *;.*$/, '')

    return instruction
}


// pass in cleaned instruction by cleanupWhitespaceAndComments()
// returns tokenized instruction to
// opcode and operands
// or
// label
function splitInstruction(instruction: string): any {
    // instruction contains at least one operand, handle operands
    if (instruction.includes(' ')) {

        // split instruction to opcode and the rest of the instruction
        // 'mov [bx+5], cx' -> ['mov', '[bx + 4], cx']
        let [all, opcode, operandsString] = instruction.match(/(\w+) (.*)/)

        // delete all spaces from operands
        // '[bx + 4], cx' -> '[bx+4],cx'
        operandsString = operandsString.replace(/ /g, '')

        // split operands by comma
        let operands = operandsString.split(',')


        // remove empty strings from operands array
        operands = operands.filter(operand => operand !== "")

        return [opcode, operands]
    } else {
        // instruction only contains one word, which can only be opcode or label
        return [instruction, []]
    }
}

// if current instruction is label, it contains ':' character at the end
// pass in cleaned instruction by cleanupWhitespaceAndComments()
function isLabel(instruction: string): boolean {
    return /:$/.test(instruction)
}


// fetches the correct values from location supplied
// location: string
const prepareOperand = (location: string): Operand => {
    // preprocess the input string
    location = location.toLowerCase()

    // if location is just a 16-bit register
    if (/^[abcd]x$/i.test(location)) {
        let registerName = location
        return {
            get: (): number => registers.get(<register>registerName),
            set: (valueToSet: number): void => {
                registers.set(<register>registerName, valueToSet)
            },
            type: "register"
        }
    }
    // if location is number only
    else if (/^[0-9]+$/i.test(location)) {
        let value = parseInt(location)
        return {
            get: (): number => value,
            set: (valueToSet: number): void => {
                throw "ERROR: prepareLocation - you can't write to immediate!"
                // console.error("prepareLocation - you can't write to immediate!")
            },
            type: "immediate"
        }
    } else {
        throw `ERROR: prepareLocation - can't parse operand '${location}'!`
    }
}

function parseInstruction(opcode, operands) {
    // check if opcode is implemented
    if (!Object.keys(opcodes).includes(opcode)) {
        throw `ERROR: parseInstruction - opcode '${opcode}' isn't implemented`
    }
    // and if it has correct amount of operands
    else if (opcodes[opcode].run.length !== operands.length) {
        throw `ERROR: parseInstruction - opcode '${opcode}' has incorrect amount of operands: ${opcodes[opcode].run.length} required, but only ${operands.length} provided`
    }

    let operand1 = operands?.[0]
    let operand2 = operands?.[1]

    let preparedOperand1
    let preparedOperand2
    let preparedOperands = []

    if (operand1) {
        preparedOperand1 = prepareOperand(operand1)
        preparedOperands.push(preparedOperand1)
    }
    if (operand2) {
        preparedOperand2 = prepareOperand(operand2)
        preparedOperands.push(preparedOperand2)
    }


    // validate operand types
    if (operands.length === 2) {
        if (preparedOperand1.type === "immediate") {
            throw "First operand can't be immediate"
        }

        if (preparedOperand1.type === "memory" && preparedOperand2.type === "memory") {
            throw "You can't access two memory places in the same instruction"
        }
    }
    else if (operands.length === 1) {
        if (preparedOperand1.type === "immediate" && opcodes[opcode].writesTo.includes('operand1')) {
            throw `Can't write to immediate ${operand1}`
        }
    }

    return {opcode: opcode, operands: preparedOperands}
}

function parseInstructionOrLabel(instruction: string): any {
    instruction = cleanupWhitespaceAndComments(instruction)
    let [opcodeOrLabel, operands] = splitInstruction(instruction)

    if (opcodeOrLabel === "") {
        return null
    }

    if (isLabel(opcodeOrLabel)) {
        return {label: opcodeOrLabel.replace(':', '')}
    } else {
        return parseInstruction(opcodeOrLabel, operands)
    }
}

// splits instruction to opcode and operands
export const parseInstructionList = (instructionList: string): any => {
    let instructions = []
    let errors = []

    // split instructions by lines and parse them
    // catch parse errors
    instructionList.split('\n').map((oneInstruction: string, index: number) => {
        let instruction = {
            original: oneInstruction, // original code line
            parsed: null
        }

        // try to parse it
        try {
            instruction.parsed = parseInstructionOrLabel(oneInstruction)
        }
        // catch any syntax errors during parsing
        catch (e) {
            let errorObj = {
                line: index,
                content: e
            }
            errors.push(errorObj)
        }

        instructions.push(instruction)
    })

    // remove empty entries
    instructions = instructions.filter(instruction => instruction.parsed !== null)

    return [instructions, errors]
}
