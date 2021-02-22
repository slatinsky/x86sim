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
        console.log("history", this.history)
    }

    stepBack() {
        if (this.history.length > 0) {
            let snapshot = this.history.pop()
            registers.load(snapshot.registers)
            memory.load(snapshot.memory)
        }
    }

    step() {
        let currentInstruction = this.instructions[registers.get('ip')]
        if (currentInstruction) {
            this.pushToHistory()
            console.log("executed", currentInstruction.line, currentInstruction.cleanedLine)
            this.executeInstruction(currentInstruction.parsed.opcode, currentInstruction.parsed.operands)
            currentInstruction = this.instructions[registers.get('ip')]
            this.updateCurrentlyExecutedLine()
        }
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
    }
}


export const compiler = new Compiler()


