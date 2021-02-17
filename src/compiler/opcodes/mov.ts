// mov instruction - copies the value
import {registers} from "../../stores/registers";

export default  {
    writesTo: ["operand1"],
    run: (operand1, operand2) => {
        operand1.set(operand2.get())
        registers.inc('ip')
    },
}
