import {allIntelRegisters, allIntelSegmentRegisters} from "../../../config"
import {opcodes, opcodes_0_operands, opcodes_1_operands} from "@compiler/opcodes";
import {get} from "svelte/store";
import {firstWord, wordCount} from '../../../helperFunctions'
import {tokenize} from "@compiler/tokenizer";
import {parseTree} from "@compiler/codeRunner";

interface iSuggestion {
    score: number,      // priority
    caption: string,    // shown in autocomplete
    value: string,      // typed in value
    meta: string     // type of autocompleted value
}

function suggestTypeOverride(suggestions: iSuggestion[]) {
    suggestions.push({
        score: 9999,
        caption: "byte ptr []",
        value: 'byte ptr []',
        meta: "type override"
    })

    suggestions.push({
        score: 9999,
        caption: "word ptr []",
        value: 'word ptr []',
        meta: "type override"
    })


    for (let segmentRegisterName of allIntelSegmentRegisters) {
        suggestions.push({
            score: 9998,
            caption: `byte ptr ${segmentRegisterName}:[]`,
            value: `byte ptr ${segmentRegisterName}:[]`,
            meta: "type override"
        })

        suggestions.push({
            score: 9998,
            caption: `word ptr ${segmentRegisterName}:[]`,
            value: `word ptr ${segmentRegisterName}:[]`,
            meta: "type override"
        })
    }

    for (let segmentRegisterName of allIntelSegmentRegisters) {
        suggestions.push({
            score: 9997,
            caption: `${segmentRegisterName}:[]`,
            value: `${segmentRegisterName}:[] `,
            meta: "memory access"
        })
    }
}

// main autocomplete
export let mainCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
        let curLine: string = session.getDocument().getLine(pos.row);
        curLine = curLine.replace(',', ', ').toLowerCase()
        curLine = curLine.replace(/\s\s+/g, ' ')   // replace multiple white space characters with one space

        // let tokens = tokenize(curLine)
        let labels: string[] = get(parseTree).filter(row => row.type === 'label').map(labelObj => labelObj.token.content)

        // inside suggestions will be all available suggestions. User can select one of them
        let suggestions: iSuggestion[] = []

        // if the user is typing the first word, it has to be an instruction or a label
        if (wordCount(curLine) === 1) {
            for (let opcode of [...Object.keys(opcodes)]) {
                let terminator
                if (opcodes_0_operands.includes(opcode)) {
                    terminator = '\n'  // this opcode doesn't need parameters - go immediately to the next line
                }
                else {
                    terminator = ' '  // instruction needs another parameter
                }

                suggestions.push({
                    score: 9999,      // top priority when sorting autocomplete list
                    caption: opcode,
                    value: opcode + terminator,
                    meta: "opcode"
                })
            }
        }
        // user is typing second word
        // autocomplete first parameter
        else if (wordCount(curLine) === 2){
            if (!opcodes.hasOwnProperty(firstWord(curLine))) {               // this opcode doesn't exist. Assume user wanted to type in label and ignore suggestions
               // do nothing
            }
            else if (opcodes[firstWord(curLine)].writesTo.includes('ip')) {  // jump instruction, suggest label names
                for (let labelName of labels) {
                    suggestions.push({
                        score: 9999,
                        caption: labelName,
                        value: labelName + '\n',
                        meta: "label"
                    })
                }
            }
            else {                                                           // else suggest register names
                for (let register of allIntelRegisters) {
                    let terminator
                    if (opcodes_1_operands.includes(firstWord(curLine))) {
                        terminator = '\n'  // this is the last parameter needed - go immediately to the next line
                    }
                    else {
                        terminator = ', '  // instruction needs another parameter
                    }
                    suggestions.push({
                        score: 9999,
                        caption: register,
                        value: register + terminator,
                        meta: "register"
                    })
                }
                suggestTypeOverride(suggestions)
            }
        }
        // user is typing third word
        // autocomplete second parameter
        else if (wordCount(curLine) === 3) {
            for (let register of allIntelRegisters) {
                suggestions.push({
                    score: 9999,
                    caption: register,
                    value: register + "\n",
                    meta: "register"
                })
            }

            if (!curLine.includes('[')) {
                suggestTypeOverride(suggestions)
            }
        }

        callback(null, suggestions)

    }
}


let snippets = [
    {
        caption: "push ax, bx, cx, dx",
        code: `push ax
push bx
push cx
push dx
`
    },
    {
        caption: "pop dx, cx, bx, ax",
        code: `pop dx
pop cx
pop bx
pop ax
`
    }
//     {
//         caption: "infinite loop",
//         code: `again:
//
//     ; ...this will be running indefinitely
//
//     jmp again
// `
//     },
//     {
//         caption: "repeat 10-times",
//         code: `push cx  ; save current cx value to stack
// mov cx, 10  ; counter
// again:
//
//     ; ...this code will run 10 times
//
//     dec cx
//     jne again  ; jump to label 'again' if cx not zero
// pop cx    ; restore original cx value from stack
// `
//     }
]



// add snippets to the editor
//https://stackoverflow.com/questions/32091515/ace-editor-auto-completion-less-priority-for-local-snippets-text
export let snippetsCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
        let curLine = session.getDocument().getLine(pos.row);
        if (wordCount(curLine) === 1) {
            callback(null, snippets.map(snippet => {
                return {
                    score: 1, // lowest priority when sorting autocomplete list
                    caption: snippet.caption,
                    snippet: snippet.code,
                    meta: "snippet"
                };
            }))
        }
        else {
            callback(null, [])
        }
    }
}
