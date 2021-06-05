import {derived, get, writable} from "svelte/store";
import {MAX_EXECUTED_INSTRUCTION_COUNT} from "@stores/config";
import {_} from "svelte-i18n";
import type {iCompiledInstruction, iError} from "@compiler/types";
import {Snapshots} from "@stores/snapshots";
import {Breakpoints} from "@stores/breakpoints";
import {CurrentlyExecutedLine} from "@stores/currentlyExecutedLine";
import {Compiler, iCompilerOutput} from "@compiler/compiler";



type tCodeRunnerStatus = 'not-runnable' | 'reset' | 'paused' | 'running' | 'ended' | 'loading-project'

export class CodeRunner {
    // public stores
    public status: any    // old codeRunnerStatus store
    public code: any      // store - contains original code string
    public debugMode: any //

    public snapshots: Snapshots
    public breakpoints: Breakpoints
    public currentlyExecutedLine
    public compiler: Compiler

    // constructor parameters
    private registers
    private settings

    get errors(): iError[] {
        return this._errors;
    }

    private _errors: iError[];
    private instructionsCompiled: iCompiledInstruction[];

    constructor(registers, settings) {
        this.registers = registers
        this.settings = settings

        this.currentlyExecutedLine = new CurrentlyExecutedLine(registers)
        this.compiler = new Compiler()


        this.breakpoints = new Breakpoints()
        this.snapshots = new Snapshots(this)
        this._errors = []
        this.instructionsCompiled = []

        this.code = writable('')
        this.status = writable<tCodeRunnerStatus>('not-runnable');

        this.debugMode = derived(this.status, (newStatus) => {
            console.log("codeRunnerStatus", newStatus)
            if (newStatus === 'not-runnable' || newStatus === 'reset') {
                return false
            }
            else if (newStatus === 'paused' || newStatus === 'running' || newStatus === 'ended' || 'loading-project') {
                return true
            }
            else {
                console.error("codeRunner.ts - codeRunnerStatus subscribe unknown status", newStatus)
                return true
            }
        });

        // compile code on code change
        setTimeout(()=> {
            this.code.subscribe(updatedCode => {
                this.compile(updatedCode)
            });
        }, 1000)
    }


    private compile(updatedCode: string): void {
        let compilationResult: iCompilerOutput = this.compiler.compile(updatedCode)
        this.instructionsCompiled = compilationResult.instructionsCompiled
        this._errors = compilationResult.errors
        console.log("compilationResult", compilationResult)
        if (compilationResult.instructionsCompiled.length > 0) {
            if (get(this.status) === 'not-runnable') {
                this.status.set('reset')
            }
        }
        else {
            this.status.set('not-runnable')
        }
    }


    // ---------- COMMANDS from navbar ----------
    public pause(): void {
        this.status.set('paused')
    }

    public async runForwards(): Promise<void> {
        await this.run(this.runNextInstruction.bind(this))
    }

    public async runBackwards(): Promise<void> {
        await this.run(this.rollbackPreviousInstruction.bind(this))
    }


    public reset(): void {
        this.pause()
        this.snapshots.rollbackAll()
        this.status.set('reset')
    }

    public step(): void {
        this.status.set('paused')
        this.runNextInstruction()
    }

    public stepBack(): void {
        this.snapshots.rollback()
    }
    // ---------- end COMMANDS ----------

    /**
     * Runs next instruction based on where ip register points to
     * Saves previous state to history, so rollbackPreviousInstruction() an restore it
     *
     * sets status to ended if there is no instruction to execute
     */
    private runNextInstruction(): void {
        let currentInstruction = this.instructionsCompiled[this.registers.get('ip')]
        if (currentInstruction) {
            this.snapshots.newSnapshot()
            currentInstruction.run()
        }
        else {
            this.status.set('ended')
        }

        this.snapshots.compareWithCurrentState()
    }

    private rollbackPreviousInstruction() {
        this.snapshots.rollback()
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
        let executedInstructionsCounter = 0  // count of instructions that run without UI rerender
        let codeExecutionDelay = this.settings.get().codeExecutionDelay
        this.status.set('running')
        while (true) {
            if (get(this.status) !== 'running') {
                return
            }

            callback()  // run next instruction or rollback previous instruction callback

            if (this.breakpoints.isBreakpointSetAtLine(get(this.currentlyExecutedLine))) {
                break
            }

            // infinite loop protection
            if (codeExecutionDelay <= 0) {
                executedInstructionsCounter++

                // nop instruction rerenders the screen :)
                if (this.instructionsCompiled[this.registers.get('ip')]?.hasOwnProperty('instruction') && this.instructionsCompiled[this.registers.get('ip')].instruction.opcode.content === 'nop') {  // is next instruction nop instruction?
                    await this.sleep(1)
                    executedInstructionsCounter = 0
                }

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
                codeExecutionDelay = this.settings.get().codeExecutionDelay   // refresh execution delay only if not already on max speed
                await this.sleep(codeExecutionDelay);
            }
        }
        this.status.set('paused')
    }
}


