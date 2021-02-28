import {get, writable} from "svelte/store";
import {MEMORY_SIZE} from "./config";
import {calculateFlags} from "../compiler/calculateFlags";

function createMemory() {
    const defaultMemory = Array(MEMORY_SIZE).fill(0)
    const {subscribe, set, update} = writable([...defaultMemory]);
    let reducedMemoryCacheValid = false     // we are caching reduce functions, because reduce is relatively expensive to compute because it is called after every instruction is executed.
                                            // Setting to false, because we need to invalidate the cache on load
                                            // every function that writes to full memory invalidates this cache
    let reducedMemoryCache = {}

    const thisStore =  {
        subscribe,
        update,
        // sets passed in register to a value manually
        set: (address: any, newValue: number) => {
            if (typeof newValue === 'undefined') {  // if svelte calls this function, 'address' is full object to update
                reducedMemoryCacheValid = false
                set(address)
            }
            else {   // else only one value is being updated
                if (address >= MEMORY_SIZE) {  // TODO: update this if after one memory cell will span multiple addresses
                    console.error(`SEGFAULT. Memory size ${MEMORY_SIZE}, you tried to access address ${address}`)
                    return
                }
                update((memory) => {
                    reducedMemoryCacheValid = false
                    memory[address] = newValue
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
            reducedMemoryCacheValid = false
            set([...defaultMemory])
        },
        get: (address: number): number => get(thisStore)[address],
        reduce: () => {  // returns all non zero memory cells, so it can be saved without wasting so much space
            if (reducedMemoryCacheValid) {  // if cache is still valid, reduce the cached values
                return reducedMemoryCache
            }
            else {   // recalculate the cache if something was changed. This calculation can be expensive if memory is large
                let mappedMemory = {}

                get(thisStore).map((value: number, address: number) => {
                    if (value !== 0)
                        mappedMemory[address] = value
                })

                reducedMemoryCache = mappedMemory  // save to cache
                reducedMemoryCacheValid = true

                return mappedMemory
            }

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
