import {firstWord, wordCount} from '../../helperFunctions'
import {registers, instructionsZeroParameters, instructionsOneParameter, instructionsTwoParameters} from "../../config"

export function annotate(editor, code) {
    console.log('annotate')
    let annotations = []
    let rows = code.split('\n')
    for(let rowIndex = 0; rowIndex < rows.length; rowIndex++){
        let row = rows[rowIndex]
        let rowWithoutComments = row.split(';')[0].trim()
        if (rowWithoutComments === "")
            continue

        let rowFirstWord = firstWord(rowWithoutComments)
        let rowWordCount = wordCount(rowWithoutComments)

        if (rowFirstWord === 'ret' && rowWordCount !== 1) {
            annotations.push({
                row: rowIndex,
                column: 0,
                text: "Arguments for 'ret' opcode are not yet implemented",
                type: "error" // also can be warning or information
            })
        }

        else if (instructionsZeroParameters.includes(rowFirstWord) && rowWordCount !== 1) {
            annotations.push({
                row: rowIndex,
                column: 0,
                text: `'${rowFirstWord}' opcode expects 0 parameters, ${rowWordCount - 1} given`,
                type: "error"
            })
        }
        else if (!rowWithoutComments.includes(':') && ![...instructionsZeroParameters, ...instructionsOneParameter, ...instructionsTwoParameters].includes(rowFirstWord)) {
            annotations.push({
                row: rowIndex,
                column: 0,
                text: `opcode '${rowFirstWord}' isn't supported by this simulator. 
                
                reIf you meant to use label, place colon at the end\n\nExample:\n${rowWithoutComments}:`,
                type: "error"
            })
        }
    }

    editor.getSession().setAnnotations(annotations);
}
