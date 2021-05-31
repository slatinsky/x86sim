import { expect } from 'chai'
import 'mocha'
import {formattedStringToInt, intToFormattedString, mergeTwo8bitTo16bit, signedToUnsignedInt, split16bitToTwo8bit, unsignedToSignedInt} from "./formatConverter"

describe('formatConverter', () => {
    it('negative signed dec to unsigned', () => {
        const result = signedToUnsignedInt(-1, 16)
        const expected = 65535
        expect(result).to.equal(expected)
    })
    it('unsigned dec -> signed overflow', () => {
        const result = unsignedToSignedInt(65535, 16)
        const expected = -1
        expect(result).to.equal(expected)
    })

    it('16-bit hex -> signed dec (negative value)', () => {
        const result = formattedStringToInt('fe0c', 'hex', 16)
        const expected = -500
        expect(result).to.equal(expected)
    })
    it('16-bit hex -> signed dec (-1)', () => {
        const result = formattedStringToInt('ffff', 'hex', 16)
        const expected = -1
        expect(result).to.equal(expected)
    })
    it('16-bit hex -> signed dec (lowest value)', () => {
        const result = formattedStringToInt('8000', 'hex', 16)
        const expected = -32768
        expect(result).to.equal(expected)
    })
    it('16-bit hex -> signed dec (highest value)', () => {
        const result = formattedStringToInt('7fff', 'hex', 16)
        const expected = 32767
        expect(result).to.equal(expected)
    })

    it('signed dec -> 16-bit hex', () => {
        const result = intToFormattedString(-500, 'hex', 16)
        const expected = 'FE0C'
        expect(result).to.equal(expected)
    })
    it('signed dec -> 16-bit hex (-1)', () => {
        const result = intToFormattedString(-1, 'hex', 16)
        const expected = 'FFFF'
        expect(result).to.equal(expected)
    })
    it('signed dec -> 16-bit hex (lowest value)', () => {
        const result = intToFormattedString(-32768, 'hex', 16)
        const expected = '8000'
        expect(result).to.equal(expected)
    })
    it('signed dec -> 16-bit hex (highest value)', () => {
        const result = intToFormattedString(32767, 'hex', 16)
        const expected = '7FFF'
        expect(result).to.equal(expected)
    })

    it('unsigned dec string -> signed dec', () => {
        const result = formattedStringToInt('0', 'unsigned', 16)
        const expected = 0
        expect(result).to.equal(expected)
    })
    it('unsigned dec string -> signed dec v2', () => {
        const result = formattedStringToInt('65535', 'unsigned', 16)
        const expected = -1
        expect(result).to.equal(expected)
    })

    it('signed dec -> unsigned dec string', () => {
        const result = intToFormattedString(0, 'unsigned', 16)
        const expected = '0'
        expect(result).to.equal(expected)
    })
    it('signed dec -> unsigned dec string', () => {
        const result = intToFormattedString(-1, 'unsigned', 16)
        const expected = '65535'
        expect(result).to.equal(expected)
    })

    it('16-bit signed dec -> 2x 8-bit signed dec', () => {
        const result = split16bitToTwo8bit(-1)
        const expected = [-1, -1]
        expect(result).deep.equal(expected)
    })
    it('16-bit signed dec -> 2x 8-bit signed dec v2', () => {
        const result = split16bitToTwo8bit(256)
        const expected = [0, 1]
        expect(result).deep.equal(expected)
    })
    it('16-bit signed dec -> 2x 8-bit signed dec (16-bit overflow)', () => {
        const result = split16bitToTwo8bit(99999999) // too large 16-bit number
        const expected = [-1, -32] // 'it always overflows to range [<-127; 128>, <-127; 128>]?'
        expect(result).deep.equal(expected)
    })
    it('2x 8-bit signed dec -> 16-bit signed dec', () => {
        const result = mergeTwo8bitTo16bit(-1, -1)
        const expected = -1
        expect(result).to.equal(expected)
    })
    it('2x 8-bit signed dec -> 16-bit signed dec v2', () => {
        const result = mergeTwo8bitTo16bit(0, 1)
        const expected = 256
        expect(result).to.equal(expected)
    })
})

