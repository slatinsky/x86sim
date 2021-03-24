import {get, writable} from "svelte/store";
import {MEMORY_SIZE} from "./config";
import {calculateFlags} from "../compiler/calculateFlags";
import {handleOverflow, mergeTwo8bitTo16bit, split16bitToTwo8bit} from "../formatConverter";

function createMemory() {
    // const defaultMemory = Array(MEMORY_SIZE).fill(0)
    const {subscribe, set, update} = writable({});

    const thisStore =  {
        subscribe,
        update,
        // sets passed in register to a value manually
        set: (address: any, newValue: number, bits: tTokenBits = 8) => {  // by default it writes only to one memory cell
            if (typeof newValue === 'undefined') {  // if svelte calls this function, 'address' is full object to update
                set(address)
            }
            else {   // else only one value is being updated
                if (address >= MEMORY_SIZE) {  // TODO: update this if after one memory cell will span multiple addresses
                    console.error(`SEGFAULT. Memory size ${MEMORY_SIZE}, you tried to access address ${address}`)
                    return
                }
                update((memory) => {
                    /**
                     * helper uses local variable "memory"
                     */
                    function setMemoryHelper(addressToSet: number, value8Bit: number): any {
                        if (value8Bit === 0 && memory.hasOwnProperty(addressToSet)) {
                            delete memory[addressToSet]
                        }
                        else {
                            memory[addressToSet] = handleOverflow(value8Bit, 8)
                        }
                    }

                    if (bits === 8) {
                        setMemoryHelper(address,  newValue)
                    }
                    else if (bits === 16) {
                        const [lowValue, highValue] = split16bitToTwo8bit(newValue)
                        setMemoryHelper(address, lowValue)
                        setMemoryHelper(address + 1, highValue)
                    }
                    else {
                        throw `runtime error - memory.set() Unknown bits parameter ${bits}`
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
        get: (address: number, bits: tTokenBits = 8): number => {
            let memoryObj = get(thisStore)
            if (bits === 8) {
                return memoryObj?.[address] ?? 0
            }
            else if (bits === 16) {
                let lowValue = memoryObj?.[address] ?? 0
                let highValue = memoryObj?.[address + 1] ?? 0
                return mergeTwo8bitTo16bit(lowValue, highValue)
            }
            else {
                throw `runtime error - memory.get() Unknown bits parameter ${bits}`
            }
        },
        reduce: () => {  // returns copy of memory object
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
