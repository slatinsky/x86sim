import {registers} from "@stores";

// Jumps if parity flag is set
// (JP) Jump Parity
// or
// (JPE) Jump Parity Even
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (label) => {
        let parityFlag = registers.get('pf')
        if (parityFlag) {
            registers.set('ip', label.get())
        }
        else {
            registers.inc('ip')
        }
    },
}
