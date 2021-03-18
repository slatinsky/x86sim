type tErrorType = 'error' | 'warning' | 'information'
interface iError {
    message: string,
    token: iToken,
    type: tErrorType
}

type tTokenType = 'numeric' | 'alphanumeric' | 'operator' | 'register' | 'comment' | 'opcode' | 'identifier' | 'mixed'   // mixed token is merged token with different types
type tTokenBits = null | 8 | 16   // null if unknown

interface iToken {
    row: number,
    col: number,
    index: number,  // character index from the beginning
    type: tTokenType,
    content: string,
    bits: tTokenBits
}

type iRow = iInstruction | iLabel

interface iOperand {
    type: 'immediate' | 'register' | 'memory' | 'label'
    tokens: iToken[]
}

interface iLabel {
    type: 'label',
    token: iToken
}

interface iInstruction {
    type: 'instruction',
    opcode: iToken
    operands: iOperand[],
    bits: tTokenBits
}

interface iCompiledInstruction {
    instruction: iInstruction,
    run: () => Promise<void>,
}

interface iCompiledOperand {
    get(): number,

    set(valueToSet: number): void,
    setWithFlags(valueToSet: number): void,

    type: 'immediate' | 'register' | 'memory' | 'label'
    labelName?: string
}
