import {get, writable} from "svelte/store";
import {MEMORY_SIZE} from "./config";

function createMemory() {
    const size = MEMORY_SIZE  // memory size
    const defaultMemory = Array(size).fill(0)
    const {subscribe, set, update} = writable([...defaultMemory]);

    const thisStore =  {
        subscribe,
        update,
        // sets passed in register to a value manually
        set: (address: number, newValue: number) => {
            update((memory) => {
                memory[address] = newValue
                memory = memory

                // TODO: handle overflow here
                return memory
            })
        },
        reset: () => set([...defaultMemory]),
        get: (address: number): number => get(thisStore)[address],
        reduce: () => {  // returns all non zero memory cells, so it can be saved without wasting so much space
            let mappedMemory = {}

            get(thisStore).map((value: number, address: number) => {
                if (value !== 0)
                    mappedMemory[address] = value
            })

            return mappedMemory
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
