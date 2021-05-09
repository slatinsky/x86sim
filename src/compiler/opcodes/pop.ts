import {registers, memory} from "@stores/stores";

// pops value from stack
export default  {
    writesTo: ["operand1"],
    run: (operand1) => {
        let sp = registers.get('sp')
        let address = (registers.get('ss') << 4) + sp
        let valueFromStack = memory.get(address, 16)
        operand1.set(valueFromStack)
        memory.set(address, 0, 16)
        registers.set('sp', sp + 2)
    },
}
