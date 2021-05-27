import {registers, memory} from "@stores";

// pushes value to stack
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (operand) => {
        // pop ip
        let sp = registers.get('sp')
        let address = (registers.get('ss') << 4) + sp
        let valueFromStack = memory.get(address, 16)
        registers.set('sp', sp + operand.get() * 2)

        // jump to ip we got from stack
        registers.set('ip', valueFromStack - 1)
    },
}
