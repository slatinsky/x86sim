import {formattedStringToInt, handleOverflow, intToFormattedString, signedToUnsignedInt, unsignedToSignedInt} from "./formatConverter";

class Flags {
    public overflow: boolean
    public carry: boolean

    constructor() {
        this.clearFlags()
    }

    public clearFlags() {
        this.overflow = false
        this.carry = false
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

    // A 'set' accessor
    set signed(valueToSet: number) {
        this._signed = handleOverflow(valueToSet, this.bits)
    }

    // A 'get' accessor
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#defining_a_getter_on_new_objects_in_object_initializers
    get signed(): number {
        return handleOverflow(this._signed, this.bits)
    }

    get unsigned(): number {
        return signedToUnsignedInt(this.signed, this.bits)
    }

    set unsigned(valueToSet: number) {
        this.signed = unsignedToSignedInt(valueToSet, this.bits)
    }


    get hex(): string {
        return intToFormattedString(this.signed, 'hex', this.bits)
    }

    set hex(valueToSet: string) {
        this.signed = formattedStringToInt(valueToSet, 'hex', this.bits)
    }


    get bin(): string {
        return intToFormattedString(this.signed, 'bin', this.bits)
    }

    set bin(valueToSet: string) {
        this.signed = formattedStringToInt(valueToSet, 'bin', this.bits)
    }

    /**
     * returns deep copy of this object
     */
    copy() {
        const newNumber = new BitNumber(this.bits)
        newNumber.signed = this.signed
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
        this.flags.clearFlags()
        let resultObj = this.copy()

        const resultSigned = callback(this.signed)
        const resultSignedWithOverflow = handleOverflow(resultSigned, this.bits)

        if (resultSigned !== resultSignedWithOverflow) {
            resultObj.flags.overflow = true
        }

        const resultUnsigned = callback(this.unsigned)
        const resultUnsignedWithOverflow = signedToUnsignedInt(handleOverflow(unsignedToSignedInt(resultUnsigned, this.bits), this.bits), this.bits)

        if (resultUnsigned !== resultUnsignedWithOverflow) {
            resultObj.flags.carry = true
        }

        resultObj.signed = resultSignedWithOverflow
        return resultObj  // allows chaining
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
}
