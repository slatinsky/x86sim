import { throttle } from 'lodash-es';
export const code = writable('')
import {get, readable, writable} from "svelte/store";
import {parseInstructionList} from "./parseInstruction";
import {memory, projectName, registers} from "../stores/stores";
import {opcodes} from "./opcodes";

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

// var i = 0
// setInterval(()=> {
//     setCurrentlyExecutedLine(i++)
// }, 1000)



class Compiler {
    instructions
    errors
    compile
    history  // step history

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
        console.log("New compiler - compiled")
        let [instructions, errors] = parseInstructionList(get(code))
        this.instructions = instructions
        this.errors = errors
        this.updateCurrentlyExecutedLine()
        setCompiledInstructions(instructions)
    }

    // if opcode is implemented is validated during parsing - it doesn't need to be checked here
    executeInstruction(opcode: string, operands) {
        opcodes[opcode].run(...operands)
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
            console.log("executed", currentInstruction.line, currentInstruction.cleanedLine)
            this.executeInstruction(currentInstruction.parsed.opcode, currentInstruction.parsed.operands)
            currentInstruction = this.instructions[registers.get('ip')]
            this.updateCurrentlyExecutedLine()
        }
        this.updateDebugModeStatus()
    }



    run() {
        // TODO: don't execute more, if we are at the end
        for (let i=0; i < 500; i++) {
            this.step()
        }
    }

    reset() {
        registers.set('ip', 0)
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


