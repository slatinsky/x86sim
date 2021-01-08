// mov instruction - copies the value
export default  {
    writesTo: ["operand1"],
    run: (operand1, operand2) => {
        operand1.set(operand2.get())
    },
}
