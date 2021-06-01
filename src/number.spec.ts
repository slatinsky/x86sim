import { expect } from 'chai'
import 'mocha'
import {BitNumber} from "./number"


describe('Number class', () => {
    it('16-bit format conversion', () => {
        const numberObj = new BitNumber(16)
        numberObj.signed = -10

        expect(numberObj.signed).to.equal(-10)
        expect(numberObj.unsigned).to.equal(65526)
        expect(numberObj.hex).to.equal('FFF6')
        expect(numberObj.bin).to.equal('1111111111110110')
    })
    it('add', () => {
        const numberObj = new BitNumber(16)
        numberObj.signed = -10
        expect(numberObj.add(2).signed).to.equal(-8)
    })
    it('add chaining', () => {
        const numberObj = new BitNumber(16)
        numberObj.signed = -10

        expect(numberObj.add(2).add(2).add(2).signed).to.equal(-4)
    })
    it('sub', () => {
        const numberObj = new BitNumber(16)
        numberObj.signed = -10

        expect(numberObj.sub(12).signed).to.equal(-22)
    })
    it('mul', () => {
        const numberObj = new BitNumber(16)
        numberObj.signed = -10

        expect(numberObj.mul(-12).signed).to.equal(120)
    })
    it('carry', () => {
        let numberObj = new BitNumber(16)
        numberObj.unsigned = 0xffff
        numberObj = numberObj.add(1);

        expect(numberObj.unsigned).to.equal(0)
        expect(numberObj.flags.overflow).to.equal(false)
        expect(numberObj.flags.carry).to.equal(true)
    })
    it('overflow', () => {
        let numberObj = new BitNumber(16)
        numberObj.signed = 0x7fff
        numberObj = numberObj.add(1);

        expect(numberObj.signed).to.equal(-32768)
        expect(numberObj.flags.overflow).to.equal(true)
        expect(numberObj.flags.carry).to.equal(false)
    })
    it('carry other way', () => {
        let numberObj = new BitNumber(16)
        numberObj.unsigned = 0
        numberObj = numberObj.sub(1)

        expect(numberObj.unsigned).to.equal(0xffff)
        expect(numberObj.flags.overflow).to.equal(false)
        expect(numberObj.flags.carry).to.equal(true)
    })
    it('overflow other way', () => {
        let numberObj = new BitNumber(16)
        numberObj.signed = -32768
        numberObj = numberObj.sub(1)
        expect(numberObj.signed).to.equal(0x7fff)
        expect(numberObj.flags.overflow).to.equal(true)
        expect(numberObj.flags.carry).to.equal(false)
    })
    it('not overflow or carry', () => {
        let numberObj = new BitNumber(16)
        numberObj.unsigned = 0xffff
        numberObj = numberObj.sub(1);

        expect(numberObj.unsigned).to.equal(0xfffe)
        expect(numberObj.flags.overflow).to.equal(false)
        expect(numberObj.flags.carry).to.equal(false)
    })

})

