import {registers, memory} from "../../stores/stores";

// pushes value to stack
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: () => {
        // pop ip
        let sp = registers.get('sp')
        let valueFromStack = memory.get(sp)

        // jump to ip we got from stack
        registers.set('ip', valueFromStack)
    },
}
