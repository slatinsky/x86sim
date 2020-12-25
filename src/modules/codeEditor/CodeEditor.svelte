<script lang="ts">
    import { debounce } from 'lodash-es';
    import { AceEditor } from "svelte-ace";
    import * as ace from "brace";
    import "brace/mode/assembly_x86";
    import "brace/theme/dracula";
    import "brace/ext/language_tools";
    import {code} from "../../store/store"
    import {mainCompleter, snippetsCompleter} from "./completers"
    import {annotate} from "./annotations.js"

    let editor
    let errorCheckingInterval
    function init(e) {
        editor = e
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

        // langTools.addCompleter(staticWordCompleter);
        langTools.setCompleters([mainCompleter, snippetsCompleter])

        // hide vertical ruler (after 80 characters in the editor)
        editor.setShowPrintMargin(false);

        // larger font
        editor.setOptions({
            fontSize: 16,
            enableBasicAutocompletion: true,
            enableSnippets: false,
            enableLiveAutocompletion: true,
            useWorker: false
        });

        // run annotate function first time after load
        setTimeout(()=>annotate(editor, $code), 2000)
    }

    // debounce annotate function - don't interrupt user while he is typing. Show/update errors only when user stops typing the code
    const debouncedAnnotate = debounce(() => annotate(editor, $code), 400)



</script>

<b>Editor kódu:</b>

<!--TODO: fix cut copy paste - https://stackoverflow.com/questions/59998538/cut-and-paste-in-ace-editor-->
<!--https://github.com/nateshmbhat/svelte-ace-->
<AceEditor
        on:selectionChange={(obj) => console.log(obj.detail)}
        on:paste={(obj) => editor.execCommand("paste", obj.detail)}
        on:input={(obj) => debouncedAnnotate(obj.detail)}
        on:focus={() => console.log('focus')}
        on:documentChange={(obj) => console.log(`document change : ${obj.detail}`)}
        on:cut={() => editor.execCommand("cut")}
        on:cursorChange={() => console.log('cursor change')}
        on:copy={() => {}}
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


