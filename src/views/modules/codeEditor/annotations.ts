import {getErrors} from "../../../compiler/compiler";

export function annotate(editor, code) {
    let errors = getErrors(code)

    let annotations = errors.map(error => {
        if (typeof error.content !== 'string') {
            console.error(error)
            error.content = "CODE PARSER CRASHED while parsing this line.\nPlease report this bug on github as issue and include your project files, so it can be fixed. Thanks:\n\n" + error.content.toString() + "\n\n" + error?.message?.toString()
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
