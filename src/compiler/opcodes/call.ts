import {registers, memory} from "@stores";

// pushes value to stack
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (label) => {
        // push next instruction address after call returns return
        let valueToPush = registers.get('ip') + 1
        let sp = registers.get('sp')
        let address = (registers.get('ss') << 4) + sp
        memory.set(address - 2, valueToPush, 16)
        registers.set('sp', sp - 2)

        // jump to label
        registers.set('ip', label.get())
    },
}
