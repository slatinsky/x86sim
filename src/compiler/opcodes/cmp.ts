import {registers} from "@stores/stores";

// subtracts operands and sets ONLY flags according to the result
export default  {
    writesTo: ["operand1"],
    run: (operand1, operand2) => {
        let result = operand1.get() - operand2.get()

        // this instruction needs to set flags without changing an register value. Mini hack to set flags is to save ax register value, set is with flags and restore it back without flags
        let ax = registers.get('ax')
        registers.setWithFlags('ax', result)
        registers.set('ax', ax)
    },
}
