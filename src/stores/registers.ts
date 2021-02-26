import {get, writable} from "svelte/store";
import type {register} from "../types/types";
import {MEMORY_SIZE} from "./config";

function createRegisters() {
    interface Register {
        ip: number,
        ax: number,
        bx: number,
        cx: number,
        dx: number,
        si: number,
        di: number,
        sp: number,
        bp: number,
        cf: boolean,
        pf: boolean,
        af: boolean,
        zf: boolean,
        sf: boolean,
        tf: boolean,
        if: boolean,
        df: boolean,
        of: boolean,
    }

    const defaultRegisters: Register = {
        ip: 0,
        ax: 0,
        bx: 0,
        cx: 0,
        dx: 0,
        si: 0,
        di: 0,
        sp: MEMORY_SIZE,  // memory size
        bp: MEMORY_SIZE,
        cf: false,
        pf: false,
        af: false,
        zf: false,
        sf: false,
        tf: false,
        if: false,
        df: false,
        of: false,
    }
    const {subscribe, set, update} = writable(Object.assign({}, defaultRegisters));

    // function saveRegistersToLocalStorage() {
    //     localStorage.setItem('registers', JSON.stringify(thisStore.reduce()))
    // }


    const thisStore = {
        subscribe,
        set: (attributeName:any, newValue) => {
            update(storeObj => {
                storeObj[attributeName] = newValue

                // TODO: handle overflow here
                return storeObj
            })
        },
        setWithFlags: (attributeName:any, newValue) => {
            thisStore.resetFlags()
            thisStore.set(attributeName, newValue)
            if (newValue == 0) {
                // Simple tutorial, how flags ar set https://www.geeksforgeeks.org/flag-register-8085-microprocessor/#:~:text=In%208085%20microprocessor%2C%20flag%20register,flag%20becomes%20set%2C%20i.e.%201.
                thisStore.set('zf', 1)

                // TODO: implement c, p, a, s, t, i, d, o
                // TODO: implement in memory too
            }
        },
        reset: () => set(Object.assign({}, defaultRegisters)),
        get: (registerName: register): number => get(thisStore)[registerName],
        reduce: () => {  // returns all non zero registers
            let registersCopy = Object.assign({}, get(thisStore))
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
            thisStore.reset()
            for (const [registerName, value] of Object.entries(reducedRegisters)) {
                thisStore.set(<register>registerName, <number>value)
            }
        },
        inc: (registerName: register) => {        // increment
            let val = thisStore.get(registerName)
            thisStore.set(registerName, val + 1)
        },
        dec: (registerName: register) => {        // decrement
            let val = thisStore.get(registerName)
            thisStore.set(registerName, val - 1)
        },
        resetFlags() {
            thisStore.set('cf', 0)
            thisStore.set('pf', 0)
            thisStore.set('af', 0)
            thisStore.set('zf', 0)
            thisStore.set('sf', 0)
            thisStore.set('tf', 0)
            thisStore.set('if', 0)
            thisStore.set('df', 0)
            thisStore.set('of', 0)
        }
    }

    return thisStore
}


export const registers = createRegisters();
