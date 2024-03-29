import {get, writable} from "svelte/store";
import type {iRow} from "@compiler/types";

export class CurrentlyExecutedLine {
    private mapping: {}
    subscribe: any
    update: any
    set: any
    registers: any

    constructor(registers) {
        this.registers = registers

        this.mapping = {}
        const {subscribe, set, update} = writable(-1);
        this.set = set
        this.subscribe = subscribe
        this.update = update

        registers.subscribe(updatedRegisters => {
            this.refreshFromIpRegister(updatedRegisters.ip)
        })
    }

    /**
     * Compilator calls this function.
     * Creates new mapping between ip register values and code editor line number
     */
    updateRows(rows: iRow[]) {
        this.mapping = {}
        let counter = 0

        for (const row of rows) {
            if (row.type === 'instruction') {
                this.mapping[counter] = row.opcode.row
                counter++
            }
        }

        this.refresh()
    }

    refresh() {
        // @ts-ignore
        this.refreshFromIpRegister(get(this.registers).ip)
    }

    private refreshFromIpRegister(ipRegister: number): void {
        this.set(this.mapping?.[ipRegister] ?? -1)
    }
}






