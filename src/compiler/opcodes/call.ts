import {registers, memory} from "../../stores/stores";

// pushes value to stack
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (label) => {
        // push next instruction address after call returns return
        let valueToPush = registers.get('ip') + 1
        let sp = registers.get('sp')
        memory.set(sp - 1, valueToPush)
        registers.set('sp', sp - 2)

        // jump to label
        registers.set('ip', label.get())
    },
}
