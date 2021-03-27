// flips all bits
export default  {
    writesTo: ["operand1"],
    run: (operand1) => {
        let result = 0 - operand1.get()
        operand1.setWithFlags(result)
    },
}
