import {registers, memory} from "../../stores/stores";

// pushes value to stack
export default  {
    writesTo: [],
    run: (operand1) => {
        let valueToPush = operand1.get()
        let sp = registers.get('sp')
        memory.set(sp - 1, valueToPush)
        registers.set('sp', sp - 1)
        registers.inc('ip')
    },
}
