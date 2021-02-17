import {memory, registers} from "../stores/stores";
import {opcodes, jumps} from "./opcodes";
import type {register} from "../types/types";
import {forEach} from "lodash-es";

interface Operand {
    get(): number,

    set(valueToSet: number): void,

    type: "immediate" | "register" | "memory" | "jump";
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
        // instruction only contains one word, which can only be opcode
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
    }
    else if (/^\[.*]$/i.test(location)) {  // memory access
        // remove []
        location = location.slice(1,-1);

        // replace '-' with '+-'
        location = location.replace(/-/g, '+-')

        // split by '+' character
        let tokenizedLocation = location.split("+")

        if (tokenizedLocation.length === 0) {
            throw `ERROR: write something inside []`
        }

        return {
            get: (): number => {
                let address = 0
                tokenizedLocation.map(token => {
                    let sign
                    if (/^-/.test(token)) {
                        // subtraction
                        sign = -1

                        // remove sign character from the beginning of a token
                        token = token.slice(1);
                    }
                    else {
                        // addition
                        sign = 1
                    }

                    if (/^[0-9]+$/i.test(token)) { // is token immediate?
                        address += parseInt(token) * sign
                    }
                    else if (['bx','si','si','sp','bp','ip'].indexOf(token) !== -1) {  // is token one of allowed registers?
                        address += registers.get(<register>token) * sign
                    }
                    else {
                        throw `ERROR: only registers bx, si, si, sp, bp, ip and immediate values can be used during memory access, you used '${token}'`
                    }
                })
                return memory.get(address)
            },
            set: (valueToSet: number): void => {
                let address = 0
                tokenizedLocation.map(token => {
                    if (/^[0-9]+$/i.test(token)) { // is token immediate?
                        address += parseInt(token)
                    }
                    else if (['bx','si','si','sp','bp','ip'].indexOf(token) !== -1) {
                        address += registers.get(<register>token)
                    }
                    else {
                        throw `ERROR: only registers bx, si, si, sp, bp, ip can be used during memory access, you used '${token}'`
                    }
                })
                memory.set(address, valueToSet)
            },
            type: "immediate"
        }
    }
    else {
        throw `ERROR: prepareLocation - can't parse operand '${location}'!`
    }
}


function prepareLabel(labelName: string, labels: any[]): Operand {
    return {
        get: (): number => {
            return labels.filter(label => label.labelName === labelName)[0].address
        },
        set: (valueToSet: number): void => {
            throw `ERROR: Cannot set label`
        },
        type: "jump"
    }
}

function parseInstruction(opcode, operands, labels: []) {
    // check if opcode is implemented
    if (!Object.keys(opcodes).includes(opcode)) {
        throw `ERROR: parseInstruction - opcode '${opcode}' isn't implemented`
    }
    // and if it has correct amount of operands
    else if (opcodes[opcode].run.length !== operands.length) {
        throw `ERROR: parseInstruction - opcode '${opcode}' has incorrect amount of operands: ${opcodes[opcode].run.length} required, but only ${operands.length} provided`
    }


    let preparedOperands = []
    let operand1 = operands?.[0]
    let operand2 = operands?.[1]
    if (opcodes[opcode].writesTo.includes('ip')) {  // if is jump
        preparedOperands[0] = prepareLabel(operand1, labels)
    }
    else {


        let preparedOperand1
        let preparedOperand2

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
    }


    return {opcode: opcode, operands: preparedOperands}
}


function parseLabel(line: string): string {
    return line.replace(/:$/, '')
}

// function parseInstructionOrLabel(instruction: string): any {
//     instruction = cleanupWhitespaceAndComments(instruction)
//     let [opcodeOrLabel, operands] = splitInstruction(instruction)
//
//     if (opcodeOrLabel === "") {
//         return null
//     }
//
//     if (isLabel(opcodeOrLabel)) {
//         return {label: opcodeOrLabel.replace(':', '')}
//     } else {
//         return parseInstruction(opcodeOrLabel, operands)
//     }
// }

// splits instruction to opcode and operands
// generates array of labels
export const parseInstructionList = (instructionList: string): any => {
    let currentAddress = 0
    let currentLine = -1
    let instructions = []
    let labels = []
    let errors = []

    // split instructions by lines and parse them
    // catch parse errors
    instructionList.split('\n').map((originalLine: string, index: number) => {
        currentLine += 1
        let cleanedLine = cleanupWhitespaceAndComments(originalLine)

        if (cleanedLine === "")  // ignore empty lines
            return

        if (isLabel(cleanedLine)) {
            labels.push({
                line: currentLine,                   // original line index
                originalLine: originalLine,          // original code line content
                cleanedLine: cleanedLine,            // cleaned instruction content (normalized whitespace, removed comments)
                labelName: parseLabel(cleanedLine),
                address: currentAddress              // label points to address of before the next instruction
            })
        }
        else {  // else is instruction
            // try to parse instruction
            try {
                let [opcode, operands] = splitInstruction(cleanedLine)
                let parsed = parseInstruction(opcode, operands, labels)

                instructions.push({
                    line: currentLine,
                    originalLine: originalLine,          // original code line
                    cleanedLine: cleanedLine,            // cleaned instruction (normalized whitespace, removed comments)
                    parsed: parsed,
                    address: currentAddress
                })
                currentAddress += 1                      // TODO: variable instruction length
            }
            catch (e) {  // catch any syntax errors during parsing
                errors.push({
                    line: index,
                    content: e
                })
                return   // ignore instruction with error
            }
        }
    })


    console.log("Instructions", instructions)
    console.log("Labels", labels)
    console.log("Errors", errors)
    return [instructions, errors]
}
