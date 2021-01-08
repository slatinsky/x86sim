import {get, writable} from "svelte/store";
import type {register} from "../types/types";
import {MEMORY_SIZE} from "./config";

function createRegisters() {
    interface Register {
        ax: number,
        bx: number,
        cx: number,
        dx: number,
        si: number,
        di: number,
        sp: number,
        bp: number,
    }

    const defaultRegisters: Register = {
        ax: 0,
        bx: 0,
        cx: 0,
        dx: 0,
        si: 0,
        di: 0,
        sp: MEMORY_SIZE,  // memory size
        bp: MEMORY_SIZE,
    }
    const {subscribe, set, update} = writable(Object.assign({}, defaultRegisters));

    function saveRegistersToLocalStorage() {
        localStorage.setItem('registers', JSON.stringify(registers.reduce()))
    }


    return {
        subscribe,

        // sets passed in register to a value manually
        set: (registerName: register, newValue: number) => {
            update((registers: Register) => {
                registers[registerName] = newValue

                // TODO: handle overflow here
                return registers
            })

            // autosave
            saveRegistersToLocalStorage()
        },
        reset: () => set(Object.assign({}, defaultRegisters)),
        get: (registerName: register): number => get(registers)[registerName],
        reduce: () => {  // returns all non zero registers
            let registersCopy = Object.assign({}, get(registers))
            Object.entries(registersCopy).map((registerEntry) => {
                let registerName = registerEntry[0]
                let value = registerEntry[1]
                if (value === 0)
                    delete registersCopy[registerName]
            })
            return registersCopy
        },
        load: (reducedRegisters) => {  // loads object returned by reduce
            console.log("LOADING")
            registers.reset()
            for (const [registerName, value] of Object.entries(reducedRegisters)) {
                registers.set(<register>registerName, <number>value)
            }
        }
    };
}


export const registers = createRegisters();
// load autosave from localstorage
if (localStorage.getItem('registers')) {
    registers.load(JSON.parse(localStorage.getItem('registers')))
}
