import { throttle } from 'lodash-es';
export const code = writable('')
import {get, readable, writable} from "svelte/store";
import {parseInstructionList} from "./parseInstruction";
import {registers} from "../stores/stores";
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

    constructor() {
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

    step() {
        let currentInstruction = this.instructions[registers.get('ip')]
        if (currentInstruction) {
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
    }
}


export const compiler = new Compiler()


