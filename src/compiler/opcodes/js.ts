import {registers} from "../../stores/stores";

// Jump if negative value
// (JS) Jump Sign
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (label) => {
        let signFlag = registers.get('sf')
        if (signFlag) {
            registers.set('ip', label.get())
        }
        else {
            registers.inc('ip')
        }
    },
}
