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

    // ---------- COMMANDS from navbar ----------
    public pause(): void {
        codeRunnerStatus.set('paused')
    }

    public async runForwards(): Promise<void> {
        await this.run(this.runNextInstruction.bind(this))
    }

    public async runBackwards(): Promise<void> {
        await this.run(this.rollbackPreviousInstruction.bind(this))
    }


    public reset(): void {
        this.pause()
        if (this.history.length > 0) {
            let firstSnapshot = this.history[0]
            registers.load(firstSnapshot.registers)
            memory.load(firstSnapshot.memory)
        }
        codeRunnerStatus.set('reset')
    }

    public async step(): Promise<void> {
        codeRunnerStatus.set('paused')
        await this.runNextInstruction()
    }

    public async stepBack(): Promise<void> {
        await this.rollbackPreviousInstruction()
    }
    // ---------- end COMMANDS ----------

    /**
     * Runs next instruction based on where ip register points to
     * Saves previous state to history, so rollbackPreviousInstruction() an restore it
     *
     * sets status to ended if there is no instruction to execute
     */
    private async runNextInstruction(): Promise<void> {
        let currentInstruction = this.instructionsCompiled[registers.get('ip')]
        if (currentInstruction) {
            let snapshot = this.makeSnapshot()
            this.history.push(snapshot)
            await currentInstruction.run()
        }
        else {
            codeRunnerStatus.set('ended')
        }
    }

    /**
     * Rollbacks previously run instruction from history
     *
     * sets codeRunnerStatus to reset if there is no history available
     */
    private async rollbackPreviousInstruction(): Promise<void> {
        if (this.history.length > 0) {
            let snapshot = this.history.pop()
            registers.load(snapshot.registers)
            memory.load(snapshot.memory)
        }

        if (this.history.length === 0) {
            codeRunnerStatus.set('reset')
        }
    }


    /**
     * Resolves promise after specified time in ms
     */
    private sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    /**
     * Main instruction runner
     * Callback is rollbackPreviousInstruction() or runNextInstruction() depending on the way we are running the program
     */
    private async run(callback: () => Promise<void>): Promise<void> {
        let executedInstructionsCounter = 0
        let codeExecutionDelay = get(settings).codeExecutionDelay
        codeRunnerStatus.set('running')
        while (true) {
            if (get(codeRunnerStatus) !== 'running') {
                return
            }
            await callback()



            if (get(breakpoints).hasOwnProperty(get(currentlyExecutedLine))) {
                break
            }

            // infinite loop protection
            if (codeExecutionDelay <= 0) {
                executedInstructionsCounter++

                if (executedInstructionsCounter >= MAX_EXECUTED_INSTRUCTION_COUNT - 1) {
                    alert(get(_)("compiler.infiniteLoop", {
                        values: {
                            maxInstructionCount: MAX_EXECUTED_INSTRUCTION_COUNT
                        }
                    }))
                    break
                }
            }
            else {
                codeExecutionDelay = get(settings).codeExecutionDelay   // refresh execution delay only if not already on max speed
                await this.sleep(codeExecutionDelay);
            }


        }
        codeRunnerStatus.set('paused')
    }


}


export const codeRunner = new CodeRunner()
