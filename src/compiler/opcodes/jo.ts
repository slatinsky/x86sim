import {registers} from "../../stores/stores";

// Jumps if overflow flag is set to 1
// (JO) Jump If Overflow
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (label) => {
        let overflowFlag = registers.get('of')
        if (overflowFlag) {
            registers.set('ip', label.get())
        }
        else {
            registers.inc('ip')
        }
    },
}
