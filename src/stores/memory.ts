import {get, writable} from "svelte/store";
import {MEMORY_SIZE} from "./config";

function createMemory() {
    const size = MEMORY_SIZE  // memory size
    const defaultMemory = Array(size).fill(0)
    const {subscribe, set, update} = writable([...defaultMemory]);

    function saveMemoryToLocalStorage() {
        localStorage.setItem('memory', JSON.stringify(memory.reduce()))
    }

    return {
        subscribe,

        // sets passed in register to a value manually
        set: (address: number, newValue: number) => {
            update((memory) => {
                memory[address] = newValue
                memory = memory

                // TODO: handle overflow here
                return memory
            })

            // autosave
            saveMemoryToLocalStorage()
        },
        reset: () => set([...defaultMemory]),
        get: (address: number): number => get(memory)[address],
        reduce: () => {  // returns all non zero memory cells, so it can be saved without wasting so much space
            let mappedMemory = {}

            get(memory).map((value: number, address: number) => {
                if (value !== 0)
                    mappedMemory[address] = value
            })

            return mappedMemory
        },
        load: (reducedMemory) => {  // loads object returned by reduce
            memory.reset()

            for (const [address, value] of Object.entries(reducedMemory)) {
                memory.set(parseInt(address), <number>value)
            }
        }
    };
}

export const memory = createMemory();
// load autosave from localstorage
if (localStorage.getItem('memory')) {
    memory.load(JSON.parse(localStorage.getItem('memory')))
}
