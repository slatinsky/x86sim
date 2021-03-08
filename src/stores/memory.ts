import {get, writable} from "svelte/store";
import {MEMORY_SIZE} from "./config";
import {calculateFlags} from "../compiler/calculateFlags";

function createMemory() {
    // const defaultMemory = Array(MEMORY_SIZE).fill(0)
    const {subscribe, set, update} = writable({});

    const thisStore =  {
        subscribe,
        update,
        // sets passed in register to a value manually
        set: (address: any, newValue: number) => {
            if (typeof newValue === 'undefined') {  // if svelte calls this function, 'address' is full object to update
                set(address)
            }
            else {   // else only one value is being updated
                if (address >= MEMORY_SIZE) {  // TODO: update this if after one memory cell will span multiple addresses
                    console.error(`SEGFAULT. Memory size ${MEMORY_SIZE}, you tried to access address ${address}`)
                    return
                }
                update((memory) => {
                    if (newValue === 0 && memory.hasOwnProperty(address)) {
                        delete memory[address]
                    }
                    else {
                        memory[address] = newValue
                    }

                    memory = memory

                    // TODO: handle overflow here
                    return memory
                })
            }
        },
        setWithFlags: (address:any, newValue) => {
            thisStore.set(address, newValue)
            calculateFlags(newValue)
        },
        reset: () => {
            set({})
        },
        get: (address: number): number => get(thisStore)[address],
        reduce: (fullMemoryArray) => {  // returns copy of memory object
            return Object.assign({}, get(thisStore))
        },
        load: (reducedMemory) => {  // loads object returned by reduce
            thisStore.reset()

            for (const [address, value] of Object.entries(reducedMemory)) {
                thisStore.set(parseInt(address), <number>value)
            }
        }
    }

    return thisStore
}

export const memory = createMemory();
// load autosave from localstorage
if (localStorage.getItem('memory')) {
    memory.load(JSON.parse(localStorage.getItem('memory')))
}
