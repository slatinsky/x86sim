import {memory, registers} from "../stores/stores";
import {opcodes, jumps} from "./opcodes";
import type {register} from "../types/types";
import {allIntelRegisters, allFlags} from "../config"
import {formattedStringToInt} from "../formatConverter";

interface Operand {
    get(): number,

    set(valueToSet: number): void,
    setWithFlags(valueToSet: number): void,

    type: "immediate" | "register" | "memory" | "jump";
    labelName?: string
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

let DEBUG = false

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

    /*
    cleanup space near commas

    before
    'mov ax, bx

    after
    'mov ax,bx'
    */
    instruction = instruction.replace(/ *, */, ',')

    /*
        Convert char to ascii
        matches this format:
            'c' -> 99
            'A' -> 65
            'a' -> 97

        Needs to be done before code is converted to lowercase
     */
    instruction = instruction.replace(/'(.)'/g, function (fullMatch:string, capturedChar: string) {
        if (capturedChar) {
            return capturedChar.charCodeAt(0)
        }
    });


    /*
    * To lowercase
    * */
    instruction = instruction.toLowerCase()

    /*
        Convert 16-bit hex string to signed dec string
        matches these two hex formats:
            0xaa5a  ->  -21926
            aa5ah   ->  -21926

        Info: can create double negative, if we are subtracting hex value that translates to negative signed integer. This will be fixed in the next step
        TODO: can replace unrelated code 'setRegistersTo0x5678:' -> setRegistersTo22136:
     */
    instruction = instruction.replace(/0x([0-9a-f]+)|([0-9a-f]+)h/g, function (fullMatch:string, capturedHex1: string, capturedHex2: string) {
        let capturedHex =  capturedHex1 ?? capturedHex2
        if (capturedHex) {
            return formattedStringToInt(capturedHex, 'hex', 16)
        }
    });

    /*
        Convert 16bit binary string to signed dec string
        matches this format:
            0b101110 -> 46

        Info: can create double negative too
        TODO: can replace unrelated code too
     */
    instruction = instruction.replace(/0b([01]+)/g, function (fullMatch:string, capturedBin: string) {
        if (capturedBin) {
            return formattedStringToInt(capturedBin, 'bin', 16)
        }
    });


    /*
    Fix double negative
    replaces '--' with '+'
     */
    instruction = instruction.replaceAll('--', '+')

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
    return /(:| proc)$/.test(instruction)
}



function parseLabel(line: string): string {
    return line.replace(/(:| proc)$/, '')
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
            setWithFlags: (valueToSet: number): void => {
                registers.setWithFlags(<register>registerName, valueToSet)
            },
            type: "register"
        }
    }
    // if location is number only
    else if (/^-?[0-9]+$/i.test(location)) {
        let value = parseInt(location)
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

        function getAddress() {
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

            return address
        }

        return {
            get: (): number => {
                return memory.get(getAddress())
            },
            set: (valueToSet: number): void => {
                memory.set(getAddress(), valueToSet)
            },
            setWithFlags: (valueToSet: number): void => {
                memory.setWithFlags(getAddress(), valueToSet)
            },
            type: "memory"
        }
    }
    else {
        if (allFlags.includes(location)) {
            throw `ERROR: Flags in flag register are indirect results of last executed instruction.\nThey can't be directly modified. You tried to modify flag '${location}'`
        }
        else {
            throw `ERROR: can't parse operand '${location}'!`
        }
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
        setWithFlags: (valueToSet: number): void => {
            throw `ERROR: Cannot set label`
        },
        type: "jump",
        labelName: labelName
    }
}

function parseInstruction(opcode, operands, labels: []) {
    // check if opcode is implemented
    if (!Object.keys(opcodes).includes(opcode)) {
        if (opcode.includes(',')) {  // handles mov, ax, bx  <- bad comma placement
            throw `ERROR: replace first comma with space:\n'${opcode}' -> ${opcode.replace(',', ' ')}`
        }
        else
        {
            if (allIntelRegisters.includes(opcode)) {
                throw `ERROR: Intel instruction set contains instruction '${opcode}', but that instruction isn't implemented by this simulator\n\nAvailable instructions:\n${Object.keys(opcodes).join('\n')}`
            }
            else {
                throw `ERROR: opcode '${opcode}' isn't a valid intel instruction.\nFormatting as comment:\n;${opcode}\n\nFormatting as label:\n${opcode}:\n\nAvailable instructions:\n${Object.keys(opcodes).join('\n')}`
            }

        }

    }
    // and if it has correct amount of operands
    else if (opcodes[opcode].run.length !== operands.length) {
        throw `ERROR: instruction '${opcode}' has incorrect amount of operands: ${opcodes[opcode].run.length} required, but only ${operands.length} provided`
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
                throw `First operand can't be immediate (provided: ${operand1}) if instruction requires 2 operands`
            }

            if (preparedOperand1.type === "memory" && preparedOperand2.type === "memory") {

                // TODO: this can be 100% simplified
                let tempRegisterName = 'ax'
                if (operand1.includes('ax') || operand2.includes('ax')) {
                    tempRegisterName = 'bx'
                    if (operand1.includes('bx') || operand2.includes('bx')) {
                        tempRegisterName = 'cx'
                        if (operand1.includes('cx') || operand2.includes('cx')) {
                            tempRegisterName = 'dx'
                        }
                    }
                }

                let generatedHint = `push ${tempRegisterName}
mov ${tempRegisterName}, ${operand2}
${opcode} ${operand1}, ${tempRegisterName}
pop ${tempRegisterName}`

                throw `Intel processor can't access two memory places in the same instruction:\n\nPossible solution:\n${generatedHint}`
            }
        }
        else if (operands.length === 1) {
            if (preparedOperand1.type === "immediate" && opcodes[opcode].writesTo.includes('operand1')) {
                throw `Can't write to immediate ${operand1}. Instruction ${opcode} requires register or memory address as a first parameter`
            }
        }
    }


    return {opcode: opcode, operands: preparedOperands}
}



// ignore unnecessary lines
function isUnnecessaryLine(cleanedLine) {
    return /^endp$/.test(cleanedLine)
}

/**
 * Checks if
 * - declared labels that are never used exists
 * - if labels can somewhere be called that don't exist yet
 * - if any label is declared more than once
 * @param labels
 * @param instructions
 * @param errors
 */
function checkLabels(labels, instructions, errors) {
    let labelNameAndEditorLineMap = []  // we need to know, which label is on which line in editor, so we can map errors back to line numbers
    let labelNamesFromLabels: string[]= labels.map(label => {
        labelNameAndEditorLineMap.push({
            line: label.line,
            labelName: label.labelName
        })
        return label.labelName
    })
    let labelNamesFromJumps: string[] = instructions.filter(instruction => instruction.parsed.operands?.[0]?.type === "jump" && instruction.parsed.operands[0].labelName)  // if it is jump/call instruction
        .map(instruction => {
            labelNameAndEditorLineMap.push({
                line: instruction.line,
                labelName: instruction.parsed.operands[0].labelName
            })
            return instruction.parsed.operands[0].labelName
        })  // get label name, where it jumps
    labelNamesFromJumps = [...new Set(labelNamesFromJumps)]  // only unique allowed

    // modified https://stackoverflow.com/a/33034768/14409632
    let allowedLabelNames = labelNamesFromLabels.filter(x => labelNamesFromJumps.includes(x));  // values in both arrays

    let labelErrors = []

    labelNamesFromLabels.map(labelName => {
        if (!allowedLabelNames.includes(labelName)) {
            labelErrors.push({
                labelName: labelName,
                content: "label " + labelName + " declared, but never used"
            })
        }
    })

    labelNamesFromJumps.map(labelName => {
        if (!allowedLabelNames.includes(labelName)) {
            labelErrors.push({
                labelName: labelName,
                content: "label " + labelName + " doesn't exist"
            })
        }
    })

    // return only duplicates from array - https://stackoverflow.com/a/32122760/14409632
    let duplicateLabels = labelNamesFromLabels.filter((e, i, a) => a.indexOf(e) !== i)
    duplicateLabels.map(labelName => labelErrors.push({
        labelName: labelName,
        content: "label " + labelName + " must be defined only once"
    }))

    labelErrors.map(labelError => {
        labelNameAndEditorLineMap.map(labelNameAndEditorLine => {
            if (labelNameAndEditorLine.labelName === labelError.labelName) {
                errors.push({
                    line: labelNameAndEditorLine.line,
                    content: labelError.content
                })
            }
        })
    })

    // add labels to the errors editor and find line numbers
    // let labelErrorsOnlyNames = labelErrors.map(labelError => labelError.labelName)
    // labels.map(label => {
    //     if (labelErrorsOnlyNames.includes(label.labelName)) {
    //         errors.push({
    //             line: label.line,
    //             content: "label " + labelName + " declared, but never used"
    //         })
    //     }
    //
    // })

    if (DEBUG) console.log("labelNamesFromLabels", labelNamesFromLabels)
    if (DEBUG) console.log("labelNamesFromJumps", labelNamesFromJumps)
    if (DEBUG) console.log("allowedLabelNames", allowedLabelNames)
    if (DEBUG) console.log("labelErrors", labelErrors)
}

/**
 * If the instruction is not in errors, add  address attribute to them
 * Ignores invalid instructions
 * Expects input instructions to be in correct order
 * Also adds address to labels
 *
 * Returns updated instructions, where invalid instructions are removed
 * Returns updated labels with added address attribute
 */
function addAddressAttribute(instructions, labels, errors) {
    const lineNumbersWithErrors = errors.map(error => error.line)

    // add address attribute to instructions
    let currentAddress = 0
    instructions = instructions.filter(instruction => {  // filter out invalid instructions
        let isInstructionValid = !lineNumbersWithErrors.includes(instruction.line)

        if (isInstructionValid) {
            instruction.address = currentAddress
            currentAddress += 1
        }

        return isInstructionValid
    })


    // add address attribute to labels
    let lineNumbersWithoutErrors = instructions.map(instruction => instruction.line)
    labels.map(label => {
        let nextInstructionLine = lineNumbersWithoutErrors.find(lineNumber => lineNumber > label.line)
        label.address = instructions.find(instruction => instruction.line === nextInstructionLine)?.address ?? (instructions?.[instructions.length - 1].address + 1) // find position based on next instruction ?? handle if no next instruction after label exists
    })

    return [instructions, labels]
}

// splits instruction to opcode and operands
// generates array of labels
export const parseInstructionList = (instructionList: string): any => {
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

        if (isUnnecessaryLine(cleanedLine))  // ignore unnecessary lines
            return

        if (isLabel(cleanedLine)) {
            labels.push({
                line: currentLine,                   // original line index
                originalLine: originalLine,          // original code line content
                cleanedLine: cleanedLine,            // cleaned instruction content (normalized whitespace, removed comments)
                labelName: parseLabel(cleanedLine),
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
                })
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

    checkLabels(labels, instructions, errors)
    let [instructionsNew, labelsNew] = addAddressAttribute(instructions, labels, errors)
    instructions = instructionsNew
    labels = labelsNew


    // let usableLabelNames = arr1.filter(x => arr2.includes(x));
    // let usableLabelNames = arr1.filter(x => arr2.includes(x));


    if (DEBUG) console.log("Instructions", instructions)
    if (DEBUG) console.log("Labels", labels)
    if (DEBUG) console.log("Errors", errors)
    return [instructions, errors]
}
