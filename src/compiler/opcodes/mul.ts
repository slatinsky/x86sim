import {registers} from "@stores";

// multiplies two numbers together
export default  {
    writesTo: [],
    run: (operand1) => {
        let ax = registers.get('ax')
        let result = operand1.get() * ax
        registers.setWithFlags('ax', result)
    },
}
