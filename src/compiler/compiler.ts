import { throttle } from 'lodash-es';
export const code = writable('')
import {get, readable, writable} from "svelte/store";
import {parseInstructionList} from "./parseInstruction";
import {memory, projectName, registers, settings} from "../stores/stores";
import {opcodes} from "./opcodes";
import {MAX_EXECUTED_INSTRUCTION_COUNT} from "../stores/config";
import {_} from 'svelte-i18n'

// called from code editor
// get errors inside compiled code
export const getErrors = (instructionToParse) => {
    let [instructions, errors] = parseInstructionList(instructionToParse)
    return errors
}


var setCurrentlyExecutedLine = (val) => {}
export const currentlyExecutedLine = readable(-1, (set) => {
    setCurrentlyExecutedLine = set
});

var setCompiledInstructions = (val) => {}
export const compiledInstructions = readable([], (set) => {
    setCompiledInstructions = set
});

var setDebugMode = (val) => {}
export const debugMode = readable(false, (set) => {
    setDebugMode = set
});

var setProgramIsRunning = (val) => {}
export const programIsRunning = readable(false, (set) => {
    setProgramIsRunning = set
});

// breakpoints
export const breakpoints = writable([])

// var i = 0
// setInterval(()=> {
//     setCurrentlyExecutedLine(i++)
// }, 1000)

let DEBUG = false

class Compiler {
    instructions
    errors
    compile
    history  // step history
    nextStepTimeout

    constructor() {
        this.history = []
        this.compile = throttle(this._compileUnthrottled, 50);  // .05 sec throttle

        // subscribe for code changes
        code.subscribe(updatedCode => {
            this.compile()
        });

        // watch ip register changes and update currentlyExecutedLine imported by the editor
        registers.subscribe(updatedRegisters => {
            this.updateCurrentlyExecutedLine()
        });

        this.updateDebugModeStatus()
    }

    updateCurrentlyExecutedLine() {
        let currentInstruction = this.instructions[registers.get('ip')]
        if (currentInstruction) {
            setCurrentlyExecutedLine(currentInstruction.line)
        }
        else {
            setCurrentlyExecutedLine(-1)
        }
    }

    updateDebugModeStatus() {
        if (this.history.length > 0) {
            setDebugMode(true)
        }
        else {
            setDebugMode(false)
        }
    }


    // unthrottled
    _compileUnthrottled() {
        if (DEBUG) console.log("New compiler - compiled")
        let [instructions, errors] = parseInstructionList(get(code))
        this.instructions = instructions
        this.errors = errors
        this.updateCurrentlyExecutedLine()
        setCompiledInstructions(instructions)
    }

    // if opcode is implemented is validated during parsing - it doesn't need to be checked here
    executeInstruction(opcode: string, operands) {
        opcodes[opcode].run(...operands)
        if (!opcodes[opcode].writesTo.includes('ip')) {  // if not jump, autoincrement ip
            registers.inc('ip')
        }
    }

    pushToHistory() {
        let snapshot = {
            registers: registers.reduce(),
            memory: memory.reduce(),
        }

        this.history.push(snapshot)
    }

    stepBack() {
        if (this.history.length > 0) {
            let snapshot = this.history.pop()
            registers.load(snapshot.registers)
            memory.load(snapshot.memory)
        }
        this.updateDebugModeStatus()
    }

    step() {
        setDebugMode(true)  // needed, because history is empty now, but we need to set debug mode before instruction is executed to stop autosaving dirty memory and registers
        let currentInstruction = this.instructions[registers.get('ip')]
        if (currentInstruction) {
            this.pushToHistory()
            if (DEBUG) console.log("executed", currentInstruction.line, currentInstruction.cleanedLine)
            this.executeInstruction(currentInstruction.parsed.opcode, currentInstruction.parsed.operands)
            currentInstruction = this.instructions[registers.get('ip')]
            this.updateCurrentlyExecutedLine()
        }
        this.updateDebugModeStatus()
    }



    run() {
        setProgramIsRunning(true)
        // TODO: don't execute more, if we are at the end

        let codeExecutionDelay = get(settings).codeExecutionDelay

        if (codeExecutionDelay <= 0) {
            for (let i=0; i < MAX_EXECUTED_INSTRUCTION_COUNT; i++) {
                this.step()

                if (get(currentlyExecutedLine) === -1) {
                    break
                }
                else if (get(breakpoints).hasOwnProperty(get(currentlyExecutedLine))) {
                    break
                }

                if (i === MAX_EXECUTED_INSTRUCTION_COUNT - 1) {
                    alert(get(_)("compiler.infiniteLoop", {
                        values: {
                            maxInstructionCount: MAX_EXECUTED_INSTRUCTION_COUNT
                        }
                    }))
                }
            }
            setProgramIsRunning(false)
        }

        else {
            this.step()
            if (get(currentlyExecutedLine) === -1) {
                setProgramIsRunning(false)
                return
            }
            else if (get(breakpoints).hasOwnProperty(get(currentlyExecutedLine))) {
                setProgramIsRunning(false)
                return
            }

            this.nextStepTimeout = setTimeout(this.run.bind(this), codeExecutionDelay)
        }
    }

    pause() {
        clearTimeout(this.nextStepTimeout)
        setProgramIsRunning(false)
    }

    reset() {
        this.pause()
        if (this.history.length > 0) {
            let firstSnapshot = this.history[0]
            registers.load(firstSnapshot.registers)
            memory.load(firstSnapshot.memory)
            this.history = []
        }
        this.updateDebugModeStatus()
    }
}


export const compiler = new Compiler()


