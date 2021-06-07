import {formattedStringToInt, handleOverflow, intToFormattedString, signedToUnsignedInt, unsignedToSignedInt} from "./formatConverter";

type tFlag = 0 | 1
class Flags {
    public overflow: tFlag
    public carry: tFlag
    public parity: tFlag
    public sign: tFlag
    public adjust: tFlag
    public zero: tFlag
    public trap: tFlag
    public interruptEnable: tFlag
    public direction: tFlag

    constructor() {
        this.clearFlags()
    }

    public clearFlags() {
        this.overflow = 0
        this.carry = 0
        this.parity = 0
        this.sign = 0
        this.adjust = 0
        this.zero = 0
        this.trap = 0
        this.interruptEnable = 0
        this.direction = 0
    }

    public copy() {
        const newFlags = new Flags()
        newFlags.overflow = this.overflow
        newFlags.carry = this.carry
        return newFlags
    }
}



export class BitNumber {
    private _signed: number
    public bits: number

    public flags: Flags

    /**
     * initializes number class
     * default number is zero
     */
    constructor(bits: number = 8) {
        this._signed = 0
        this.bits = bits
        this.flags = new Flags()
    }

    public setSigned(valueToSet: number): BitNumber {
        let copy = this.copy()
        copy._signed = handleOverflow(valueToSet, this.bits)

        copy.flags.parity = copy.getParity()
        copy.flags.zero = copy.getZero()
        copy.flags.sign = copy.getSign()
        return copy
    }
    public setUnsigned(valueToSet: number): BitNumber {
        return this.setSigned(unsignedToSignedInt(valueToSet, this.bits))
    }
    public setHex(valueToSet: string): BitNumber {
        return this.setSigned(formattedStringToInt(valueToSet, 'hex', this.bits))
    }
    public setBin(valueToSet: string): BitNumber {
        return this.setSigned(formattedStringToInt(valueToSet, 'bin', this.bits))
    }

    // A 'set' accessor   // removed, because BitNumber object should stay immutable
    set signed(valueToSet: number) {
        throw "removed - do not use signed set accessor"
    }
    set unsigned(valueToSet: number) {
        throw "removed - do not use unsigned set accessor"
    }
    set hex(valueToSet: string) {
        throw "removed - do not use hex set accessor"
    }
    set bin(valueToSet: string) {
        throw "removed - do not use hex set accessor"
    }

    // A 'get' accessor
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#defining_a_getter_on_new_objects_in_object_initializers
    get signed(): number {
        return handleOverflow(this._signed, this.bits)
    }
    get unsigned(): number {
        return signedToUnsignedInt(this.signed, this.bits)
    }
    get hex(): string {
        return intToFormattedString(this.signed, 'hex', this.bits)
    }
    get bin(): string {
        return intToFormattedString(this.signed, 'bin', this.bits)
    }


    /**
     * returns sign flag (the most significant bit)
     * 1 if signed number is negative
     * 0 otherwise
     */
    private getSign() {
        if (this.signed < 0) {
            return 1
        }
        else {
            return 0
        }
    }

    /**
     * returns zero flag
     * 1 if number is zero
     * 0 otherwise
     */
    private getZero() {
        if (this.signed === 0) {
            return 1
        }
        else {
            return 0
        }
    }

    /**
     * returns parity flag
     * 1 if the result has even parity (an even number of 1 bits)
     * 0 otherwise
     */
    private getParity() {
        if ((this.bin.split("1").length - 1) % 2 === 0) {
            return 1
        }
        else {
            return 0
        }
    }






    /**
     * returns deep copy of this object
     */
    copy() {
        const newNumber = new BitNumber(this.bits)
        newNumber._signed = this._signed
        newNumber.flags = this.flags.copy()
        return newNumber
    }

    /**
     * If we use this special operation, we want to compute both overflow and carry flags
     * Called from functions like add(), sub(), mul()
     * Doesn't mutate original object - returns a copy
     *
     * Get computed flags using
     *      returnedObject.flags.overflow
     *      returnedObject.flags.carry
     *
     * As parameter it expects callback function with one parameter.
     *      That callback function will be called twice:
     *          1) parameter is signed number (to compute overflow flag and result)
     *          2) parameter is unsigned number (to compute carry flag)
     */
    run(callback): BitNumber {
        this.flags.clearFlags()  // set all flags to zero
        let resultObj = this.copy()

        // calculate overflow
        const resultSigned = callback(this.signed)
        const resultSignedWithOverflow = handleOverflow(resultSigned, this.bits)
        if (resultSigned !== resultSignedWithOverflow) {
            resultObj.flags.overflow = 1
        }

        // calculate cary
        const resultUnsigned = callback(this.unsigned)
        const resultUnsignedWithOverflow = signedToUnsignedInt(handleOverflow(unsignedToSignedInt(resultUnsigned, this.bits), this.bits), this.bits)

        if (resultUnsigned !== resultUnsignedWithOverflow) {
            resultObj.flags.carry = 1
        }
        return resultObj.setSigned(resultSignedWithOverflow)  // allows chaining
    }

    add(newNumber: number): BitNumber {
        return this.run((signedOrUnsigned) => signedOrUnsigned + newNumber)
    }
    sub(newNumber: number): BitNumber {
        return this.run((signedOrUnsigned) => signedOrUnsigned - newNumber)
    }
    mul(newNumber: number): BitNumber {
        return this.run((signedOrUnsigned) => signedOrUnsigned * newNumber)
    }
    and(newNumber: number): BitNumber {
        return this.run((signedOrUnsigned) => signedOrUnsigned & newNumber)
    }
    xor(newNumber: number): BitNumber {
        return this.run((signedOrUnsigned) => signedOrUnsigned ^ newNumber)
    }
}
