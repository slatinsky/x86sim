import { expect } from 'chai'
import 'mocha'
import {Registers} from "@stores/registers";

const registers = new Registers();

describe('registers', () => {
    it('get and set value 10', () => {
        registers.set('ax', 10)

        const result = registers.get('ax')
        const expected = 10
        expect(result).to.equal(expected)
    })
    it('inc', () => {
        registers.set('ax', 10)
        registers.inc('ax')

        const result = registers.get('ax')
        const expected = 11
        expect(result).to.equal(expected)
    })
    it('dec', () => {
        registers.set('ax', 10)
        registers.dec('ax')

        const result = registers.get('ax')
        const expected = 9
        expect(result).to.equal(expected)
    })
    it('parity flag for even value', () => {
        registers.setWithFlags('ax', 10)

        const result = registers.get('pf')
        const expected = 1
        expect(result).to.equal(expected)
    })
    it('parity flag for odd value', () => {
        registers.setWithFlags('ax', 11)

        const result = registers.get('pf')
        const expected = 0
        expect(result).to.equal(expected)
    })
    it('zero flag for non zero value', () => {
        registers.setWithFlags('ax', 11)

        const result = registers.get('zf')
        const expected = 0
        expect(result).to.equal(expected)
    })
    it('zero flag for zero value', () => {
        registers.setWithFlags('ax', 0)

        const result = registers.get('zf')
        const expected = 1
        expect(result).to.equal(expected)
    })
    it('sign flag for negative value', () => {
        registers.setWithFlags('ax', -1)

        const result = registers.get('sf')
        const expected = 1
        expect(result).to.equal(expected)
    })
    it('sign flag for positive value', () => {
        registers.setWithFlags('ax', 11)

        const result = registers.get('sf')
        const expected = 0
        expect(result).to.equal(expected)
    })
    it('sign flag for zero value', () => {
        registers.setWithFlags('ax', 0)

        const result = registers.get('sf')
        const expected = 0
        expect(result).to.equal(expected)
    })
    it('overflow flag for large value that should overflow', () => {
        registers.setWithFlags('ax', 99999999999)

        const result = registers.get('of')
        const expected = 1
        expect(result).to.equal(expected)
    })
    it('overflow flag for large negative value that should overflow', () => {
        registers.setWithFlags('ax', -99999999999)

        const result = registers.get('of')
        const expected = 1
        expect(result).to.equal(expected)
    })
    it('overflow flag for value that shouldn\' overflow', () => {
        registers.setWithFlags('ax', 88)

        const result = registers.get('of')
        const expected = 0
        expect(result).to.equal(expected)
    })
})

