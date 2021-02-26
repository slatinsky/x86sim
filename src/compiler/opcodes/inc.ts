// increments by one
import {registers} from "../../stores/registers";

export default  {
    writesTo: ["operand1"],
    run: (operand1) => {
        let result = operand1.get() + 1
        operand1.setWithFlags(result)
    },
}
