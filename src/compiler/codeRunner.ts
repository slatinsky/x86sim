import {debounce, DebouncedFunc, throttle} from "lodash-es";
import {registers} from "../stores/registers";
import {get, writable} from "svelte/store";
import {memory} from "../stores/memory";
import {settings} from "../stores/settings";
import {MAX_EXECUTED_INSTRUCTION_COUNT} from "../stores/config";
import {compileParseTree, currentlyExecutedLine} from "./compileParseTree";
import {_} from "svelte-i18n";
import {tokenize} from "./tokenizer";
import {createParseTree} from "./createParseTree";
import {validateParseTree} from "./validateParseTree";
import {delete_rule} from "svelte/types/runtime/internal/style_manager";
import {objectKeyDifferences} from "../helperFunctions";


// breakpoints
export const breakpoints = writable([])
export const differences = writable({
    registers: [],
    memory: [],
})

export const code = writable('')
export const lineAddressMapping = writable<{ [key: number]: number }>({})

interface iHistorySnapshot { // TODO add more strict types
    registers: any,
    memory: any
}

type tCodeRunnerStatus = 'not-runnable' | 'reset' | 'paused' | 'running' | 'ended' | 'loading-project'
export const codeRunnerStatus = writable<tCodeRunnerStatus>('not-runnable');
export const debugMode = writable<boolean>(false);

codeRunnerStatus.subscribe((newStatus: tCodeRunnerStatus) => {
    console.log("codeRunnerStatus", newStatus)
    if (newStatus === 'not-runnable' || newStatus === 'reset') {
        debugMode.set(false)
    }
    else if (newStatus === 'paused' || newStatus === 'running' || newStatus === 'ended' || 'loading-project') {
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
    private readonly compile: (updatedCode: string) => void;
    private history: iHistorySnapshot[];
    private _errors: iError[];
    private instructionsCompiled: iCompiledInstruction[];

    constructor() {
        this.history = []
        // this.compile = throttle(this._compileUnthrottled, 50);  // .05 sec throttle - not updating correctly last change
        this.compile = this._compileUnthrottled
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

        let tokens = tokenize(updatedCode)
        let [rowsNew, errorsNew] = createParseTree(tokens)
        let errorsNew2
        [errorsNew2, rowsNew] = validateParseTree(rowsNew)


        let [instructionsNewCompiled, errorsNew3] = compileParseTree(rowsNew)
        this.instructionsCompiled = instructionsNewCompiled

        if (instructionsNewCompiled.length > 0) {
            if (get(codeRunnerStatus) === 'not-runnable') {
                codeRunnerStatus.set('reset')
            }
        }
        else {
            codeRunnerStatus.set('not-runnable')
        }

        this.updateLineAddressMapping()

        this._errors = [].concat(errorsNew).concat(errorsNew2).concat(errorsNew3)  // TODO: errors from old compiler are intentionally removed
    }

    private makeSnapshot(): iHistorySnapshot {
        return {
            registers: registers.reduce(),
            memory: memory.reduce(),
        }
    }

    /**
     * Compares latest snapshot saved in the stack with current (newest) version
     */
    private compareWithSnapshot() {
        if (this.history.length > 0) {
            let currentVersion = this.makeSnapshot()

            let latestSnapshot = this.history[this.history.length - 1]

            // we will store there names of different registers or memory addresses
            let newDifferences = {
                registers: objectKeyDifferences(currentVersion.registers, latestSnapshot.registers),
                memory: objectKeyDifferences(currentVersion.memory, latestSnapshot.memory),
            }
            differences.set(newDifferences)
        }
        else {
            differences.set({
                registers: [],
                memory: [],
            })
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
            this.history = []  // empty history
        }
        codeRunnerStatus.set('reset')
        this.compareWithSnapshot()
    }

    public step(): void {
        codeRunnerStatus.set('paused')
        this.runNextInstruction()
    }

    public stepBack(): void {
        this.rollbackPreviousInstruction()
    }
    // ---------- end COMMANDS ----------

    /**
     * Runs next instruction based on where ip register points to
     * Saves previous state to history, so rollbackPreviousInstruction() an restore it
     *
     * sets status to ended if there is no instruction to execute
     */
    private runNextInstruction(): void {
        let currentInstruction = this.instructionsCompiled[registers.get('ip')]
        if (currentInstruction) {
            let snapshot = this.makeSnapshot()
            this.history.push(snapshot)
            currentInstruction.run()
        }
        else {
            codeRunnerStatus.set('ended')
        }
        this.compareWithSnapshot()
    }

    /**
     * Rollbacks previously run instruction from history
     *
     * sets codeRunnerStatus to reset if there is no history available
     */
    private rollbackPreviousInstruction(): void {
        if (this.history.length > 0) {
            let snapshot = this.history.pop()
            registers.load(snapshot.registers)
            memory.load(snapshot.memory)
        }

        if (this.history.length === 0) {
            codeRunnerStatus.set('reset')
        }
        else if (get(codeRunnerStatus) === 'ended'){
            codeRunnerStatus.set('paused')
        }
        this.compareWithSnapshot()
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
    private async run(callback: () => void): Promise<void> {
        let executedInstructionsCounter = 0
        let codeExecutionDelay = get(settings).codeExecutionDelay
        codeRunnerStatus.set('running')
        while (true) {
            if (get(codeRunnerStatus) !== 'running') {
                return
            }

            callback()  // run next instruction or rollback previous instruction callback

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
