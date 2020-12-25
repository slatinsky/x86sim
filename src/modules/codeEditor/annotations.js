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

        // custom error messages for common problems, so users can better understand the problem
        if (rowFirstWord === 'ret' && rowWordCount !== 1) {
            annotations.push({
                row: rowIndex,
                column: 0,
                // text: "Arguments for 'ret' opcode are not yet implemented",
                text: "Parametre pre 'ret' opcode ešte nie sú podporované",
                type: "error" // also can be warning or information
            })
        }
        else if (instructionsZeroParameters.includes(rowFirstWord) && rowWordCount !== 1) {
            annotations.push({
                row: rowIndex,
                column: 0,
                // text: `'${rowFirstWord}' opcode expects 0 parameters, ${rowWordCount - 1} given`,
                text: `'${rowFirstWord}' opcode očakáva 0 parametrov, poskytnutých ${rowWordCount - 1}`,
                type: "error"
            })
        }
        else if (rowWithoutComments.includes(':') && rowWithoutComments.includes(' ')) {
            annotations.push({
                row: rowIndex,
                column: 0,
                text: `Label '${rowWithoutComments}' nemôže obsahovať medzery\n\nSkúste label '${rowWithoutComments}' premenovať napríklad na:\n${rowWithoutComments.replace(' ', '_')}`,
                type: "error"
            })
        }
        else if (!rowWithoutComments.includes(':') && ![...instructionsZeroParameters, ...instructionsOneParameter, ...instructionsTwoParameters].includes(rowFirstWord)) {
            annotations.push({
                row: rowIndex,
                column: 0,
                // text: `opcode '${rowFirstWord}' isn't supported by this simulator.\n\nIf you meant to use label, place colon at the end\n\nExample:\n${rowWithoutComments}:`,
                text: `opcode '${rowFirstWord}' nie je podporovaný týmto simulátorom.\n\nAk ste chceli použiť 'label', použite znak ':' na konci\n\nPríklad:\n${rowFirstWord}:\n\nAk ste chceli napísať komentár, použite znak ';' na začiatku komentára\n\nPríklad:\n;${rowWithoutComments}`,
                type: "error"
            })
        }
        else {
            // TODO: no custom error message try to 'compile' the code and return invalid lines
        }

    }

    editor.getSession().setAnnotations(annotations);
}
