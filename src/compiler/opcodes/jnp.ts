import {registers} from "../../stores/stores";

// Jumps if parity flag is not set
// (JNP) Jump No Parity
// or
// (JPO) Jump Parity Odd
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (label) => {
        let parityFlag = registers.get('pf')
        if (!parityFlag) {
            registers.set('ip', label.get())
        }
        else {
            registers.inc('ip')
        }
    },
}
