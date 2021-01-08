// increments by one
export default  {
    writesTo: ["operand1"],
    run: (operand1) => {
        let result = operand1.get() + 1
        operand1.set(result)
    },
}
