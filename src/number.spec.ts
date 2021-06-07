import { expect } from 'chai'
import 'mocha'
import {BitNumber} from "./number";

describe('Number class', () => {
    it('is immutable', () => {  // every action creates new object copy
        const numberObj = new BitNumber(16).setSigned(-10)
        const numberObj2 = numberObj.add(2)
        const numberObj3 = numberObj.setUnsigned(2)
        expect(numberObj.signed).to.equal(-10)
    })
    it('16-bit format conversion', () => {
        const numberObj = new BitNumber(16).setSigned(-10)

        expect(numberObj.signed).to.equal(-10)
        expect(numberObj.unsigned).to.equal(65526)
        expect(numberObj.hex).to.equal('FFF6')
        expect(numberObj.bin).to.equal('1111111111110110')
    })
    it('add', () => {
        const numberObj = new BitNumber(16).setSigned(-10)
        expect(numberObj.add(2).signed).to.equal(-8)
    })
    it('add chaining', () => {
        const numberObj = new BitNumber(16).setSigned(-10)
        expect(numberObj.add(2).add(2).add(2).signed).to.equal(-4)
    })
    it('sub', () => {
        const numberObj = new BitNumber(16).setSigned(-10)
        expect(numberObj.sub(12).signed).to.equal(-22)
    })
    it('mul', () => {
        const numberObj = new BitNumber(16).setSigned(-10)
        expect(numberObj.mul(-12).signed).to.equal(120)
    })
    it('flags: carry', () => {
        let numberObj = new BitNumber(16).setUnsigned(0xffff)
        numberObj = numberObj.add(1);

        expect(numberObj.unsigned).to.equal(0)
        expect(numberObj.flags.overflow).to.equal(0)
        expect(numberObj.flags.carry).to.equal(1)
    })
    it('flags: overflow', () => {
        let numberObj = new BitNumber(16).setSigned(0x7fff)
        numberObj = numberObj.add(1);

        expect(numberObj.signed).to.equal(-32768)
        expect(numberObj.flags.overflow).to.equal(1)
        expect(numberObj.flags.carry).to.equal(0)
    })
    it('flags: carry other way', () => {
        let numberObj = new BitNumber(16).setUnsigned(0)
        numberObj = numberObj.sub(1)

        expect(numberObj.unsigned).to.equal(0xffff)
        expect(numberObj.flags.overflow).to.equal(0)
        expect(numberObj.flags.carry).to.equal(1)
    })
    it('flags: overflow other way', () => {
        let numberObj = new BitNumber(16).setSigned(-32768)
        numberObj = numberObj.sub(1)
        expect(numberObj.signed).to.equal(0x7fff)
        expect(numberObj.flags.overflow).to.equal(1)
        expect(numberObj.flags.carry).to.equal(0)
    })
    it('flags: not overflow or carry', () => {
        let numberObj = new BitNumber(16).setUnsigned(0xffff)
        numberObj = numberObj.sub(1);

        expect(numberObj.unsigned).to.equal(0xfffe)
        expect(numberObj.flags.overflow).to.equal(0)
        expect(numberObj.flags.carry).to.equal(0)
    })

    it('flags: parity even', () => {
        let numberObj = new BitNumber(16).setSigned(0b0)
        expect(numberObj.flags.parity).to.equal(1)
    })
    it('flags: parity even v2', () => {
        let numberObj = new BitNumber(16).setSigned(0b011011)
        expect(numberObj.flags.parity).to.equal(1)
    })
    it('flags: parity odd', () => {
        let numberObj = new BitNumber(16).setSigned(0b010011)
        expect(numberObj.flags.parity).to.equal(0)
    })
    it('flags: zero', () => {
        let numberObj = new BitNumber(16).setSigned(0)
        expect(numberObj.flags.zero).to.equal(1)
    })
    it('flags: not zero', () => {
        let numberObj = new BitNumber(16).setSigned(-77)
        expect(numberObj.flags.zero).to.equal(0)
    })
    it('flags: sign zero', () => {
        let numberObj = new BitNumber(16).setSigned(0)
        expect(numberObj.flags.sign).to.equal(0)
    })
    it('flags: sign positive', () => {
        let numberObj = new BitNumber(16).setSigned(66)
        expect(numberObj.flags.sign).to.equal(0)
    })
    it('flags: sign negative', () => {
        let numberObj = new BitNumber(16).setSigned(-66)
        expect(numberObj.flags.sign).to.equal(1)
    })

})

