import {get, writable} from "svelte/store";
import {MEMORY_SIZE} from "./config";
import {calculateFlags} from "@compiler/calculateFlags";
import {handleOverflow, mergeTwo8bitTo16bit, split16bitToTwo8bit} from "../formatConverter";
import {toastQueue} from "@stores/toastQueue";


export class Memory {
    this: any
    subscribe: any
    update: any
    setSvelte: any  // original svelte set

    constructor() {
        const {subscribe, set, update} = writable({});

        this.setSvelte = set
        this.subscribe = subscribe
        this.update = update

        // load autosave from localstorage
        if (localStorage.getItem('memory')) {
            memory.load(JSON.parse(localStorage.getItem('memory')))
        }
    }


    set(address: any, newValue: number, bits: tTokenBits = 8) {  // by default it writes only to one memory cell
        if (typeof newValue === 'undefined') {  // if svelte calls this function, 'address' is full object to update
            this.setSvelte(address)
        }
        else {   // else only one value is being updated
            if (address >= MEMORY_SIZE) {  // TODO: update this if after one memory cell will span multiple addresses
                console.error(`SEGFAULT. Memory size ${MEMORY_SIZE}, you tried to access address ${address}`)
                toastQueue.error(`SEGFAULT. Memory size ${MEMORY_SIZE}, you tried to access address ${address}`)
                return
            }
            else if (address < 0) {
                console.error(`SEGFAULT. You tried to write to negative address '${address}' :(. This is a simulator bug, please report it.`)  // this bug should be fixed now. It should never happen
                toastQueue.error(`SEGFAULT. You tried to write to negative address '${address}' :(. This is a simulator bug, please report it.`)
                return
            }
            this.update((memory) => {
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
                    toastQueue.error(`runtime error - memory.set() Unknown bits parameter ${bits}`)
                    throw `runtime error - memory.set() Unknown bits parameter ${bits}`
                }


                memory = memory

                // TODO: handle overflow here
                return memory
            })
        }
    }
    setWithFlags(address:any, newValue, bits: tTokenBits = 8) {
        this.set(address, newValue, bits)
        let storedNewValue = this.get(address, bits)  // if overflow occurred, actual stored value is different
        calculateFlags(newValue, storedNewValue)
    }
    reset() {
        this.setSvelte({})
    }
    get(address: number, bits: tTokenBits = 8): number {
        let memoryObj = get(this)
        if (bits === 8) {
            return memoryObj?.[address] ?? 0
        }
        else if (bits === 16) {
            let lowValue = memoryObj?.[address] ?? 0
            let highValue = memoryObj?.[address + 1] ?? 0
            return mergeTwo8bitTo16bit(lowValue, highValue)
        }
        else {
            toastQueue.error(`runtime error - memory.get() Unknown bits parameter ${bits}`)
            throw `runtime error - memory.get() Unknown bits parameter ${bits}`
        }
    }
    reduce() {  // returns copy of memory object
        return Object.assign({}, get(this))
    }
    load(reducedMemory) {  // loads object returned by reduce
        this.reset()

        for (const [address, value] of Object.entries(reducedMemory)) {
            this.set(parseInt(address), <number>value)
        }
    }
}

// TODO: move this to stores.ts
export const memory = new Memory();
