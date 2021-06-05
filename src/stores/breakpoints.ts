import {writable, get} from "svelte/store";

export class Breakpoints {
    public subscribe: any
    private update: any
    public set: any  // original svelte set

    constructor() {
        const {subscribe, set, update} = writable(new Set());
        this.subscribe = subscribe
        this.set = set
        this.update = update
    }

    /**
     * set breakpoints - ace editor uses format like this:
     * [empty × 2, "ace_breakpoint", empty × 2, "ace_breakpoint"]
     *
     *
     * we want to convert it to Set() that contains line numbers
     */
    setAce(aceBreakpointArray: []) {
        let newLineNumbers = new Set()
        for (let i = 0; i < aceBreakpointArray.length; i++) {
            if (aceBreakpointArray[i] === "ace_breakpoint") {
                newLineNumbers.add(i)
            }
        }

        this.set(newLineNumbers)
    }

    /**
     * returns breakpoints in ace editor format
     */
    getAce(): string[] {
        let aceBreakpointArray = []
        let arr = this.reduce();
        for (const lineNumber of arr) {
            aceBreakpointArray[lineNumber] = "ace_breakpoint"
        }
        return aceBreakpointArray
    }

    isBreakpointSetAtLine(lineNumber: number): boolean {
        return this.get().has(lineNumber)
    }

    clear() {
        this.set([])
    }

    reduce(): number[] {
        return [...this.get()].sort()
    }

    load(reducedArray: number[]): void {
        this.set(new Set(reducedArray))
    }

    get(): Set<number>  {
        return get(this)
    }

    setBreakpoint(lineNumber): void {
        if (!isNaN(lineNumber)) {
            let updatedSet = this.get()
            updatedSet.add(lineNumber)
            this.set(updatedSet)
        }
        else {
            console.warn("setBreakpoint, lineNumber is NaN")
        }
    }
    clearBreakpoint(lineNumber): void {
        if (!isNaN(lineNumber)) {
            let updatedSet = this.get()
            updatedSet.delete(lineNumber)
            this.set(updatedSet)
        }
        else {
            console.warn("clearBreakpoint, lineNumber is NaN")
        }
    }
}
