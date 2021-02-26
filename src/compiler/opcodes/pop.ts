import {registers, memory} from "../../stores/stores";

// pops value from stack
export default  {
    writesTo: ["operand1"],
    run: (operand1) => {
        let sp = registers.get('sp')
        let valueFromStack = memory.get(sp)
        operand1.set(valueFromStack)

        memory.set(sp, 0)
        registers.set('sp', sp + 1)
    },
}
