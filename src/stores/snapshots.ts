import {get, writable} from "svelte/store";
import {memory, registers, settings} from "@stores";
import {objectKeyDifferences} from "../helperFunctions";

interface iHistorySnapshot { // TODO add more strict types
    registers: any,
    memory: any
}


/**
 * This class is only used by codeRunner
 *
 * exposed two stores to public:
 * - executedInstructionsCount
 * - differences
 *      don't write to these stores outside Snapshots class
 *
 */

export class Snapshots {
    private snapshots: iHistorySnapshot[];
    private codeRunner: any
    private historyEnabled: any                        // derived store, updated automatically
    public readonly executedInstructionsCount: any     // store
    public differences: any                            // store with difference, updated in compareWithCurrentState()

    constructor(codeRunner) {
        this.snapshots = []
        this.codeRunner = codeRunner
        this.executedInstructionsCount = writable(0)

        this.historyEnabled = false
        settings.subscribe(newSettings => {
            this.historyEnabled = newSettings.codeExecutionHistory
        })

        this.differences = writable({
            registers: [],
            memory: [],
        })
    }

    getExecutedInstructionsCountStore() {
        return this.executedInstructionsCount
    }

    /**
     * Returns amount of snapshots made
     */
    getCount () {
        return this.snapshots.length
    }

    /**
     * Returns true if no snapshot exists
     */
    public isEmpty(): boolean {
        return this.getCount() === 0;
    }


    /**
     * Rollbacks previously run instruction from history
     *
     * sets codeRunnerStatus to reset if there is no history available
     */
    public rollback(): void {
        if (!this.isEmpty()) {
            // rollback memory and registers
            let snapshot = this.snapshots.pop()
            registers.load(snapshot.registers)
            memory.load(snapshot.memory)
        }

        // update status
        if (this.isEmpty()) {
            this.codeRunner.status.set('reset')
        }
        else if (get(this.codeRunner.status) === 'ended'){
            this.codeRunner.status.set('paused')
        }

        this.executedInstructionsCount.set(Math.max(0, <number>get(this.executedInstructionsCount) - 1))

        this.compareWithCurrentState()
    }


    public rollbackAll() {
        if (!this.isEmpty()) {
            let firstSnapshot = this.snapshots[0]
            registers.load(firstSnapshot.registers)
            memory.load(firstSnapshot.memory)
            this.snapshots = []  // empty history
        }
        this.executedInstructionsCount.set(0)
        this.compareWithCurrentState()
    }


    private createSnapshot(): iHistorySnapshot {
        return {
            registers: registers.reduce(),
            memory: memory.reduce(),
        }
    }

    /**
     * Compares latest snapshot saved in the stack with current (newest) version
     */
    public compareWithCurrentState() {
        if (this.historyEnabled) {
            if (!this.isEmpty()) {
                let currentVersion = this.createSnapshot()

                let latestSnapshot = this.snapshots[this.snapshots.length - 1]

                // we will store there names of different registers or memory addresses
                let newDifferences = {
                    registers: objectKeyDifferences(currentVersion.registers, latestSnapshot.registers),
                    memory: objectKeyDifferences(currentVersion.memory, latestSnapshot.memory),
                }
                // console.log("newDifferences", newDifferences)
                this.differences.set(newDifferences)
            }
            else {
                this.differences.set({
                    registers: [],
                    memory: [],
                })
            }
        }
    }

    /**
     * creates new snapshot if history is enabled in settings
     */
    public newSnapshot() {
        if (this.historyEnabled || this.isEmpty()) {  // we need to push first snapshot to stack even if history is disabled, so we can restore it later after reset
            let snapshot = this.createSnapshot()
            this.snapshots.push(snapshot)
        }
        this.executedInstructionsCount.set(<number>get(this.executedInstructionsCount) + 1)
    }
}
