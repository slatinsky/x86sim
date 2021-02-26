import {registers, memory} from "../../stores/stores";

// pushes value to stack
export default  {
    writesTo: ['ip'], // writes to ip, because it is jump
    run: (label) => {
        let zeroFlag = registers.get('zf')
        console.log("zeroFlag", zeroFlag)
        if (!zeroFlag) {
            registers.set('ip', label.get())
        }
        else {
            registers.inc('ip')
        }
    },
}
