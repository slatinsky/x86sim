import { expect } from 'chai'
import 'mocha'
import {Registers} from "@stores/registers";
import {Memory} from "@stores/memory";

export const registers = new Registers();
export const memory = new Memory(registers);

describe('memory', () => {
    it('get and set value 10', () => {
        memory.set(0, 10,8)

        const result = memory.get(0, 8)
        const expected = 10
        expect(result).to.equal(expected)
    })
    it('set too large value - it should overflow', () => {
        memory.set(0, 256,8)

        const result = memory.get(0, 8)
        const expected = 0
        expect(result).to.equal(expected)
    })
    it('set 16 bit value, read 2x 8 bits', () => {
        memory.set(0, 258,16)

        // little endian

        const result1 = memory.get(0, 8)
        const expected1 = 2
        expect(result1).to.equal(expected1)

        const result2 = memory.get(1, 8)
        const expected2 = 1
        expect(result2).to.equal(expected2)
    })
    it('get and set at unsigned 20-bit address', () => {  // 0xc0000 would be negative if it was signed 20-bit -> it would be invalid address
        memory.set(0xc0000, 100,8)

        const result = memory.get(0xc0000, 8)
        const expected = 100
        expect(result).to.equal(expected)
    })
    it('parity flag - even number of bits', () => {
        memory.setWithFlags(0, 0b0011,8)

        const result = registers.get('pf')
        const expected = 1
        expect(result).to.equal(expected)
    })
    it('parity flag - odd number of bits', () => {
        memory.setWithFlags(0, 0b0010,8)

        const result = registers.get('pf')
        const expected = 0
        expect(result).to.equal(expected)
    })
})

