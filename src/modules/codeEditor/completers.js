import {registers, instructionsZeroParameters, instructionsOneParameter, instructionsTwoParameters} from "../../config"

import {firstWord, wordCount} from '../../helperFunctions'

// main autocomplete
export let mainCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
        let curLine = session.getDocument().getLine(pos.row);
        // if the user is typing the first word, it has to be an instruction or a label
        // TODO: add label autocomplete
        if (wordCount(curLine) === 1) {
            callback(null, [...instructionsZeroParameters, ...instructionsOneParameter, ...instructionsTwoParameters].map(opcode => {
                let terminator
                if (instructionsZeroParameters.includes(opcode)) {
                    terminator = '\n'  // this opcode doesn't need parameters - go immediately to the next line
                }
                else {
                    terminator = ' '  // instruction needs another parameter
                }
                return {
                    score: 9999,      // top priority when sorting autocomplete list
                    caption: opcode,
                    value: opcode + terminator,
                    meta: "opcode"
                };
            }));
        }
        // first parameter
        else if (wordCount(curLine) === 2){
            callback(null, registers.map(register => {
                let terminator
                if (instructionsOneParameter.includes(firstWord(curLine))) {
                    terminator = '\n'  // this is the last parameter needed - go immediately to the next line
                }
                else {
                    terminator = ', '  // instruction needs another parameter
                }
                return {
                    score: 9999,
                    caption: register,
                    value: register + terminator,
                    meta: "register"
                };
            }));
        }
        // second parameter
        // TODO: refactor the check, don't expect the delimeter to be space, it is a comma
        else if (wordCount(curLine) === 3) {
            callback(null, registers.map(register => {
                return {
                    score: 9999,
                    caption: register,
                    value: register + "\n",
                    meta: "register"
                };
            }));
        }
        else {
            callback(null, [])
        }

    }
}


let snippets = [
    {
        caption: "save registers to stack",
        code: `; save registers to stack
push ax
push bx
push cx
push dx

; ...your code 

; restore registers from stack
pop dx
pop cx
pop bx
pop ax
`
    },
    {
        caption: "infinite loop",
        code: `again:
        
    ; ...this will be running indefinitely
    
    jmp again
`
    },
    {
        caption: "repeat 10-times",
        code: `push cx  ; save current cx value to stack
mov cx, 10  ; counter
again:
    
    ; ...this code will run 10 times
    
    dec cx
    jne again  ; jump to label 'again' if cx not zero
pop cx    ; restore original cx value from stack
`
    }
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
