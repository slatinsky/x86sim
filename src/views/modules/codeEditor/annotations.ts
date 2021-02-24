import {getErrors} from "../../../compiler/compiler";

export function annotate(editor, code) {
    let errors = getErrors(code)

    let annotations = errors.map(error => {
        return {
            row: error.line,
            column: 0,
            text: error.content,
            type: "error" // also can be warning or information
        }
    })

    editor.getSession().setAnnotations(annotations);
}
