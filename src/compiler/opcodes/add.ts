import {registers, memory} from "../../stores/stores";

// adds two numbers together
export default  {
    writesTo: ["operand1"],
    run: (operand1, operand2) => {
        let result = operand1.get() + operand2.get()
        operand1.set(result)
        registers.inc('ip')
    },
}
