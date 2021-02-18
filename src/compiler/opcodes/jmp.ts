import {registers, memory} from "../../stores/stores";

// pushes value to stack
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (label) => {
        registers.set('ip', label.get())  // TODO: set ip to address, where label points
    },
}