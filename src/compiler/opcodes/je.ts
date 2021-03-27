import {registers} from "../../stores/stores";

export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (label) => {
        let zeroFlag = registers.get('zf')
        if (zeroFlag) {
            registers.set('ip', label.get())
        }
        else {
            registers.inc('ip')
        }
    },
}
