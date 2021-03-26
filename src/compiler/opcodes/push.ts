import {registers, memory} from "../../stores/stores";

// pushes value to stack
export default  {
    writesTo: [],
    run: (operand1) => {
        let valueToPush = operand1.get()
        let sp = registers.get('sp')
        let address = (registers.get('ss') << 4) + sp
        memory.set(address - 2, valueToPush, 16)
        registers.set('sp', sp - 2)
    },
}
