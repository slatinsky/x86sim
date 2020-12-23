<script lang="ts">
    import { AceEditor } from "svelte-ace";
    import * as ace from "brace";
    import "brace/mode/assembly_x86";
    import "brace/theme/dracula";
    import "brace/ext/language_tools";
    import {code} from "../store"
    let editor
    function init(editor) {
        window.editor = editor

        // custom line formatting: https://stackoverflow.com/questions/28311086/modify-the-gutter-of-ajax-org-cloud9-editor-ace-editor
        editor.session.gutterRenderer =  {
            getWidth: function(session, lastLineNumber, config) {
                return lastLineNumber.toString().length * config.characterWidth;
            },
            getText: function(session, row) {

                // console.log(editor.session.getLine(4))  //get fourth line, will be usefull later
                return (row+7000).toString().padStart(4, '0');
            }
        };

        // add autocomplete to the editor
        // https://stackoverflow.com/a/30047705/14409632
        // https://github.com/thlorenz/brace/issues/19#issuecomment-74065730
        var langTools = ace.acequire("ace/ext/language_tools");
        let staticWordCompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                console.log(pos)
                var wordList = ["mov", "jmp", "je", "jne"];
                callback(null, wordList.map(function(word) {
                    console.log("word", word)
                    return {
                        score: 9999, // top priority when sorting
                        caption: word,
                        value: word,
                        meta: "static"
                    };
                }));
            }
        }

        // add snippets to the editor
        //https://stackoverflow.com/questions/32091515/ace-editor-auto-completion-less-priority-for-local-snippets-text
        let snippetsCompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                var completions = [];
                completions.push({
                    caption: "save registers to stack",
                    snippet: `// save registers to stack
push ax
push bx
push cx
push dx

...your code

// restore registers from stack
pop dx
pop cx
pop bx
pop ax`,
                    meta: "snippet"
                });
                callback(null, completions);
            }
        }
        langTools.addCompleter(staticWordCompleter);
        langTools.addCompleter(snippetsCompleter);

        // hide vertical ruler (after 80 characters in the editor)
        editor.setShowPrintMargin(false);

        // larger font
        editor.setOptions({
            fontSize: 16,
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
    }


</script>

<b>Editor kódu:</b>
<!--https://github.com/nateshmbhat/svelte-ace-->
<AceEditor
        on:selectionChange={(obj) => console.log(obj.detail)}
        on:paste={(obj) => console.log(obj.detail)}
        on:input={(obj) => console.log(obj.detail)}
        on:focus={() => console.log('focus')}
        on:documentChange={(obj) => console.log(`document change : ${obj.detail}`)}
        on:cut={() => console.log('cut')}
        on:cursorChange={() => console.log('cursor change')}
        on:copy={() => console.log('copy')}
        on:init={(editor) => init(editor.detail)}
        on:commandKey={(obj) => console.log(obj.detail)}
        on:changeMode={(obj) => console.log(`change mode : ${obj.detail}`)}
        on:blur={() => console.log('blur')}
        width='100%'
        height='90vh'
        lang="assembly_x86"
        theme="dracula"
        bind:value={$code}
/>


