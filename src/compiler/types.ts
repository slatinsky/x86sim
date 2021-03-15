type tErrorType = 'error' | 'warning' | 'information'
interface iError {
    message: string,
    token: iToken,
    type: tErrorType
}

type tTokenType = 'numeric' | 'alphanumeric' | 'operator' | 'register' | 'comment' | 'opcode' | 'identifier'

interface iToken {
    row: number,
    col: number,
    index: number,  // character index from the beginning
    type: tTokenType,
    content: string
}

type iRow = iInstruction | iLabel

interface iOperand {
    type: 'immediate' | 'register' | 'memory' | 'label'
    tokens: iToken[]
}

interface iLabel {
    type: 'label',
    name: string
    row: number,
    col: number,
    index: number
}

interface iInstruction {
    type: 'instruction',
    opcode: string
    operands: iOperand[],
    row: number,
    col: number,
    index: number
}
