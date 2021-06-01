import {get, writable} from "svelte/store";
import type {tRegister} from "../types/types";
import {MEMORY_SIZE} from "./config";
import {handleOverflow, intToFormattedString, mergeTwo8bitTo16bit, split16bitToTwo8bit} from "../formatConverter";

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
    cs: number,
    ds: number,
    ss: number,
    es: number,
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


export class Registers {
    subscribe: any
    update: any
    setSvelte: any  // original svelte set

    defaultRegisters: Register = {
        ip: 0,
        ax: 0,
        bx: 0,
        cx: 0,
        dx: 0,
        si: 0,
        di: 0,
        sp: MEMORY_SIZE,  // memory size
        bp: MEMORY_SIZE,
        cs: 0,
        ds: 0,
        ss: 0,
        es: 0,
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

    constructor() {
        const {subscribe, set, update} = writable(Object.assign({}, this.defaultRegisters));
        this.setSvelte = set
        this.subscribe = subscribe
        this.update = update
    }


    set(registerName: tRegister, newValue: number) : void {
        if (/^[a-d]l$/i.test(registerName)) {        // al, bl, cl, dl
            newValue = mergeTwo8bitTo16bit(newValue, this.get(<tRegister>registerName.replace('l', 'h')))
            registerName = <tRegister>registerName.replace('l', 'x')
            // console.log("low register", highValue, lowValue, newValue, registerName)
        }
        else if (/^[a-d]h$/i.test(registerName)) {   // ah, bh, ch, dh
            newValue = mergeTwo8bitTo16bit(this.get(<tRegister>registerName.replace('h', 'l')), newValue)
            registerName = <tRegister>registerName.replace('h', 'x')
            // console.log("high register", highValue, lowValue, newValue, registerName)
        }

        this.update(storeObj => {
            // @ts-ignore
            storeObj[registerName] = handleOverflow(newValue, 16) // TODO: is register there always 16-bit?
            return storeObj
        })
    }


    setWithFlags(attributeName:any, newValue) {
        this.set(attributeName, newValue)
        let storedNewValue = this.get(attributeName)  // if overflow occurred, actual stored value is different
        this.calculateFlags(newValue, storedNewValue)
    }


    reset() {
        this.setSvelte(Object.assign({}, this.defaultRegisters))
    }


    get(registerName: tRegister): number {
        let registerValue = <number>get(this)[registerName.replace(/[lh]$/, 'x')]  // TODO: is it ok to cast boolean to number?
        if (/[a-d]l/i.test(registerName)) {         // al, bl, cl, dl
            const [lowValue, highValue] = split16bitToTwo8bit(registerValue)
            return lowValue
        }
        else if (/[a-d]h/i.test(registerName)) {    // ah, bh, ch, dh
            const [lowValue, highValue] = split16bitToTwo8bit(registerValue)
            return highValue
        }
        else {
            return registerValue
        }
    }

    reduce() {  // returns all non zero registers
        let registersCopy = Object.assign({}, get(this))
        Object.entries(registersCopy).map((registerEntry) => {
            let registerName = registerEntry[0]
            let value = registerEntry[1]
            if (value === 0 || value === false)
                delete registersCopy[registerName]
        })
        return registersCopy
    }

    load(reducedRegisters) {  // loads object returned by reduce
        this.reset()
        for (const [registerName, value] of Object.entries(reducedRegisters)) {
            this.set(<tRegister>registerName, <number>value)
        }
    }

    inc(registerName: tRegister) {        // increment
        let val = this.get(registerName)
        this.set(registerName, val + 1)
    }

    dec(registerName: tRegister) {        // decrement
        let val = this.get(registerName)
        this.set(registerName, val - 1)
    }

    resetFlags() {
        this.set('cf', 0)
        this.set('pf', 0)
        this.set('af', 0)
        this.set('zf', 0)
        this.set('sf', 0)
        this.set('tf', 0)
        this.set('if', 0)
        this.set('df', 0)
        this.set('of', 0)
    }

    /**
     * @param newValue Value that should be stored
     * @param storedNewValue Value that was actually stored (corrected with overflow to fit)
     */
    calculateFlags(newValue, storedNewValue) {
        this.resetFlags()  // all flags to zero

        // TODO: implement c, a, t, i, d
        // Simple tutorial, how flags ar set https://www.geeksforgeeks.org/flag-register-8085-microprocessor/#:~:text=In%208085%20microprocessor%2C%20flag%20register,flag%20becomes%20set%2C%20i.e.%201.
        if (storedNewValue == 0) {  // if value is zero, then set zero flag to 1
            this.set('zf', 1)
        }
        if (storedNewValue < 0) { // if most significant bit is set to one, then set sign flag to 1
            this.set('sf', 1)
        }

        let newValueInBinary: string = intToFormattedString(storedNewValue, 'bin', 16)
        let binaryOnesCount = (newValueInBinary.split("1").length - 1)
        if (binaryOnesCount % 2 === 0) {  // if even number of ones, set parity flag to 1
            this.set('pf', 1)
        }

        if (newValue !== storedNewValue) {  // if stored value is not the value we wanted to store, overflow occurred
            this.set('of', 1)
        }
        // console.log("newValue, storedNewValue", newValue, storedNewValue)
    }
}


