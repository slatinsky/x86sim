import {getErrors} from "../../../compiler/compiler";
import * as ace from "brace";
const Range = ace.acequire('ace/range').Range

var markers = []

export function annotate(editor, code) {
    let errors = getErrors(code)

    // remove old syntax error markers
    for (const marker of markers) {
        editor.session.removeMarker(marker)
    }

    let annotations = errors.map(error => {
        if (typeof error.content !== 'string') {
            if (error.hasOwnProperty('token')) {
                markers.push(editor.session.addMarker(new Range(error.token.row, error.token.col, error.token.row, error.token.col + error.token.content.length), "ace_error_line"))
                return {
                    row: error.token.row,
                    column: error.token.col - 1,
                    text: error.message,
                    type: "error" // also can be warning or information
                }
            }
            else {
                console.error("annotation error", error)
                // error.content = "CODE PARSER CRASHED while parsing this line.\nPlease report this bug on github as issue and include your project files, so it can be fixed. Thanks:\n\n" + error.content.toString() + "\n\n" + error?.message?.toString()
            }
            error.content = 'error'
        }
        return {
            row: error.line,
            column: 0,
            text: error.content.toString(),
            type: "error" // also can be warning or information
        }
    })

    editor.getSession().setAnnotations(annotations);
}
