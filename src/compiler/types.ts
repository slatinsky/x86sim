export type tErrorType = 'error' | 'warning' | 'information'
export interface iError {
    message: string,
    token: iToken,
    type: tErrorType
}

export type tTokenType = 'numeric' | 'alphanumeric' | 'operator' | 'register' | 'comment' | 'opcode' | 'identifier' | 'mixed' | 'type_override'   // mixed token is merged token with different types
export type tTokenBits = null | 8 | 16   // null if unknown
export type tSegment = null | 'cs' | 'ds' | 'ss' | 'es'   // null if unknown

export interface iToken {
    row: number,
    col: number,
    index: number,  // character index from the beginning
    type: tTokenType,
    content: string,
    value: null | number,
    bits: tTokenBits
}

export type iRow = iInstruction | iLabel

export interface iOperand {
    type: 'immediate' | 'register' | 'memory' | 'label'
    tokens: iToken[]
}

export interface iLabel {
    type: 'label',
    token: iToken
    position: iToken,
}

export interface iInstruction {
    type: 'instruction',
    position: iToken,
    opcode: iToken
    operands: iOperand[],
    bits: tTokenBits,
    segment: tSegment
}

export interface iCompiledInstruction {
    instruction: iInstruction,
    run: () => void,
}

export interface iCompiledOperand {
    get(): number,

    set(valueToSet: number): void,
    setWithFlags(valueToSet: number): void,

    type: 'immediate' | 'register' | 'memory' | 'label'
    labelName?: string
}
