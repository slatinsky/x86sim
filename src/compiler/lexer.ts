// import {allIntelOpcodes} from "../config"
//
// interface iOriginalLine {
//     line: number,
//     original: string
// }
//
// interface iCleanedLine {
//     line: number,
//     cleaned: string,
//     original: string,
// }
//
// interface iLineWithType {
//     line: number,
//     cleaned: string,
//     original: string,
//     type: 'label' | 'instruction' | 'unrecognized'
// }
//
// interface iLineParsed {
//     line: number,
//     cleaned: string,
//     original: string,
//     type: 'label' | 'instruction' | 'unrecognized',
//     parsed: iLabel | iInstruction
// }
//
// interface iLabel {
//     name: string
// }
//
// interface iInstruction {
//     opcode: string
//     operands: iOperand[]
// }
//
// interface iOperand {
//     type: "immediate" | "register" | "memory"
//     content: string
// }
//
//
//
// function splitLines(instructionList: string): iOriginalLine[] {
//     return instructionList.split('\n').map((original: string, line: number) => {
//         return {line, original}
//     })
// }
//
// function cleanupLines(lines: iOriginalLine[]): iCleanedLine[] {
//
//     return lines.map((line: iOriginalLine) => {
//         let cleanedLine = line.original
//
//         /*
//    Change tabs to spaces
//    Also replaces multiple continuous whitespace characters to one space
//     */
//         cleanedLine.replace(/[ \t]+/g, ' ');
//
//         /*
//         trim whitespace from the beginning and the end
//         before
//         '    mov    ax    ,   bx    '
//
//         after
//         'mov    ax    ,   bx'
//         */
//         cleanedLine = cleanedLine.trim()
//
//         /*
//         delete comments (text after ; character)
//         [ ' *'   match whitespace before character ;
//         ;.*$     delete everything after charracter ;, including ;
//
//         before
//         'mov ax, bx  ; this is a comment'
//
//         after
//         'mov ax, bx'
//         */
//         cleanedLine = cleanedLine.replace(/ *;.*$/, '')
//
//         /*
//         cleanup space near commas
//
//         before
//         'mov ax, bx
//
//         after
//         'mov ax,bx'
//         */
//         cleanedLine = cleanedLine.replace(/ *, */, ',')
//
//
//         /*
//         * To lowercase
//         * */
//         cleanedLine = cleanedLine.toLowerCase()
//
//
//         return {
//             ...line,
//             cleaned: cleanedLine
//         }
//     })
// }
//
// // if current instruction is label, it contains ':' character at the end
// // pass in cleaned instruction by cleanupWhitespaceAndComments()
// function isLabel(cleanedLine: string): boolean {
//     return /(:| proc)$/.test(cleanedLine)
// }
//
// function isInstruction(cleanedLine: string): boolean {
//     let firstWord = cleanedLine.match(/^([a-z]+)/)?.[1]
//     if (firstWord && allIntelOpcodes.includes(firstWord)) {
//         return true
//     }
//     else {
//         return false
//     }
// }
//
// function detectType(lines: iCleanedLine[]): iLineWithType[] {
//     return lines.map((line: iCleanedLine) => {
//         if (isLabel(line.cleaned)) {
//             return {...line, type: 'label'}
//         } else if (isInstruction(line.cleaned)) {
//             return {...line, type: 'instruction'}
//         }
//         else {
//             return {...line, type: 'unrecognized'}
//         }
//     })
// }
//
//
// export function run(instructionList: string) {
//     console.log("running, input:", instructionList)
//
//     let lines = splitLines(instructionList)
//     console.log("lines", lines)
//
//     let cleanedLines = cleanupLines(lines)
//     console.log("cleanedLines", cleanedLines)
//
//     let linesWithDetectedType = detectType(cleanedLines)
//     console.log("linesWithDetectedType", linesWithDetectedType)
//
// }
