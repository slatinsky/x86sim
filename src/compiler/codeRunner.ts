import {DebouncedFunc, throttle} from "lodash-es";
import {registers} from "../stores/registers";
import {parseInstructionList} from "./parseInstruction";
import {get, writable} from "svelte/store";
import {opcodes} from "./opcodes";
import {memory} from "../stores/memory";
import {settings} from "../stores/settings";
import {MAX_EXECUTED_INSTRUCTION_COUNT} from "../stores/config";
import {compileParseTree, currentlyExecutedLine} from "./compileParseTree";
import {_} from "svelte-i18n";
import {tokenize} from "./tokenizer";
import {createParseTree} from "./createParseTree";
import {validateParseTree} from "./validateParseTree";


// breakpoints
export const breakpoints = writable([])

export const code = writable('')
export const lineAddressMapping = writable<{ [key: number]: number }>({})

interface iHistorySnapshot { // TODO add more strict types
    registers: any,
    memory: any
}

type tCodeRunnerStatus = 'not-runnable' | 'reset' | 'paused' | 'running' | 'ended'
export const codeRunnerStatus = writable<tCodeRunnerStatus>('not-runnable');
export const debugMode = writable<boolean>(false);

codeRunnerStatus.subscribe((newStatus: tCodeRunnerStatus) => {
    console.log("codeRunnerStatus", newStatus)
    if (newStatus === 'not-runnable' || newStatus === 'reset') {
        debugMode.set(false)
    }
    else if (newStatus === 'paused' || newStatus === 'running' || newStatus === 'ended') {
        debugMode.set(true)
    }
    else {
        console.error("codeRunner.ts - codeRunnerStatus subscribe unknown status", newStatus)
    }
});

class CodeRunner {
    get errors(): iError[] {
        return this._errors;
    }
    private readonly compile: DebouncedFunc<(updatedCode: string) => [iCompiledInstruction[], any]>;
    private history: iHistorySnapshot[];
    private _errors: iError[];
    private instructionsCompiled: iCompiledInstruction[];

    constructor() {
        this.history = []
        this.compile = throttle(this._compileUnthrottled, 50);  // .05 sec throttle
        this._errors = []
        this.instructionsCompiled = []


        // subscribe for code changes
        code.subscribe(updatedCode => {
            this.compile(updatedCode)
        });

    }


    /**
     * creates object that maps ip register and editor line, so editor can display expected ip register in line gutter
     *
     * lineAddressMapping:
     *      key = ip register
     *      value = editor row
     */
    private updateLineAddressMapping() {
        let newLineAddressMapping: { [key: number]: number } = {}
        console.log("this.instructionsCompiled", this.instructionsCompiled)
        for (const [ip, instructionCompiled] of Object.entries(this.instructionsCompiled)) {
            let editorRow = instructionCompiled.instruction.opcode.row
            newLineAddressMapping[editorRow] = parseInt(ip)
        }
        lineAddressMapping.set(newLineAddressMapping)
    }

    // unthrottled
    private _compileUnthrottled(updatedCode: string): void {
        this.pause()

        let tokens = tokenize(updatedCode)
        let [rowsNew, errorsNew] = createParseTree(tokens)
        let errorsNew2
        [errorsNew2, rowsNew] = validateParseTree(rowsNew)


        let instructionsNewCompiled = compileParseTree(rowsNew)
        this.instructionsCompiled = instructionsNewCompiled

        if (instructionsNewCompiled.length > 0) {
            codeRunnerStatus.set('reset')
        }
        else {
            codeRunnerStatus.set('not-runnable')
        }

        this.updateLineAddressMapping()

        this._errors = [].concat(errorsNew).concat(errorsNew2)  // TODO: errors from old compiler are intentionally removed
    }

    private makeSnapshot(): iHistorySnapshot {
        return {
            registers: registers.reduce(),
            memory: memory.reduce(),
        }
    }

    pushToHistory(): void {
        let snapshot = this.makeSnapshot()
        this.history.push(snapshot)
    }

    stepBack(): void {
        if (this.history.length > 0) {
            let snapshot = this.history.pop()
            registers.load(snapshot.registers)
            memory.load(snapshot.memory)
        }
    }

    step(): void {
        codeRunnerStatus.set('paused')
        // setDebugMode(true)  // needed, because history is empty now, but we need to set debug mode before instruction is executed to stop autosaving dirty memory and registers
        let currentInstruction = this.instructionsCompiled[registers.get('ip')]
        if (currentInstruction) {
            this.pushToHistory()
            currentInstruction.run()
            currentInstruction = this.instructionsCompiled[registers.get('ip')]
            // this.updateCurrentlyExecutedLine()
        }
        // this.updateDebugModeStatus()
    }

    pause(): void {

    }

    run(): void {

    }

    reset(): void {
        this.pause()
        if (this.history.length > 0) {
            let firstSnapshot = this.history[0]
            registers.load(firstSnapshot.registers)
            memory.load(firstSnapshot.memory)
            codeRunnerStatus.set('reset')
        }
    }
}


export const codeRunner = new CodeRunner()
