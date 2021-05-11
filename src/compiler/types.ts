type tErrorType = 'error' | 'warning' | 'information'
interface iError {
    message: string,
    token: iToken,
    type: tErrorType
}

type tTokenType = 'numeric' | 'alphanumeric' | 'operator' | 'register' | 'comment' | 'opcode' | 'identifier' | 'mixed'   // mixed token is merged token with different types
type tTokenBits = null | 8 | 16   // null if unknown
type tSegment = null | 'cs' | 'ds' | 'ss' | 'es'   // null if unknown

interface iToken {
    row: number,
    col: number,
    index: number,  // character index from the beginning
    type: tTokenType,
    content: string,
    value: null | number,
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
    position: iToken,
}

interface iInstruction {
    type: 'instruction',
    position: iToken,
    opcode: iToken
    operands: iOperand[],
    bits: tTokenBits,
    segment: tSegment
}

interface iCompiledInstruction {
    instruction: iInstruction,
    run: () => void,
}

interface iCompiledOperand {
    get(): number,

    set(valueToSet: number): void,
    setWithFlags(valueToSet: number): void,

    type: 'immediate' | 'register' | 'memory' | 'label'
    labelName?: string
}
