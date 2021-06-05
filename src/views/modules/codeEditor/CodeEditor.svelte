<script lang="ts">
    import { debounce } from 'lodash-es'
    import { AceEditor } from "svelte-ace"
    import * as ace from "brace"
    import "brace/mode/assembly_x86"
    import "brace/theme/dracula"
    import "brace/theme/chrome"
    import "brace/ext/language_tools"
    import {
        code,
        currentlyExecutedLine,
        settings,
        lineAddressMapping,
        breakpoints
    } from "../../../stores"
    import {mainCompleter, snippetsCompleter} from "./completers"
    import {annotate} from "./annotations.js"
    import {_} from 'svelte-i18n'
    import {intToFormattedString} from "../../../formatConverter";
    import {onDestroy} from "svelte";

    $: theme = $settings.darkTheme ? 'dracula' : 'chrome';
    let editor
    let errorCheckingInterval

    let editorFocused = false

    let EMPTY_GUTTER = "   "
    let unsubscribeCurrentlyExecutedLine
    let unsubscribeBreakpoints

    function isBreakpointPlaceableAtRow(rowNumber) {
        return editor.session.gutterRenderer.getText(editor.session, rowNumber) !== EMPTY_GUTTER  // if gutter is empty, breakpoint should not be placed
    }

    function init(e) {
        editor = e
        window.editor = editor

        // custom line formatting: https://stackoverflow.com/questions/28311086/modify-the-gutter-of-ajax-org-cloud9-editor-ace-editor
        editor.session.gutterRenderer =  {
            getWidth: function(session, lastLineNumber, config) {
                return lastLineNumber.toString().length * config.characterWidth;
            },
            getText: function(session, row) {
                // console.log(editor.session.getLine(4))  //get fourth line, will be useful later
                if ($lineAddressMapping.hasOwnProperty(row)) {
                    return intToFormattedString($lineAddressMapping[row], $settings.selectedFormat, 16)
                }
                else {
                    return EMPTY_GUTTER
                }
            }
        }

        // add autocomplete to the editor
        // https://stackoverflow.com/a/30047705/14409632
        // https://github.com/thlorenz/brace/issues/19#issuecomment-74065730
        var langTools = ace.acequire("ace/ext/language_tools")

        // langTools.addCompleter(staticWordCompleter);
        langTools.setCompleters([mainCompleter, snippetsCompleter])

        // hide vertical ruler (after 80 characters in the editor)
        editor.setShowPrintMargin(false)

        // larger font
        editor.setOptions({
            fontSize: 16,
            enableBasicAutocompletion: true,
            enableSnippets: false,
            enableLiveAutocompletion: true,
            useWorker: false,
            wrap: true
        });



        /**
         * apply breakpoints set inside breakpoints store
         */
        unsubscribeBreakpoints = breakpoints.subscribe(newBreakpoints => {
            // remove old breakpoints
            const breakpointsArrayToRemove = editor.session.getBreakpoints()
            for (let lineNumber = 0; lineNumber < breakpointsArrayToRemove.length; lineNumber++) {
                if (breakpointsArrayToRemove[lineNumber] === "ace_breakpoint") {
                    editor.session.clearBreakpoint(lineNumber)
                }
            }

            // add new breakpoints
            for (const lineNumber of newBreakpoints) {
                editor.session.setBreakpoint(lineNumber)
            }
        })

        /**
         * add / remove breakpoints by clicking the gutter next to line number inside ace editor
         * https://ourcodeworld.com/articles/read/1052/how-to-add-toggle-breakpoints-on-the-ace-editor-gutter
         */
        editor.on("guttermousedown", function(e) {
            var target = e.domEvent.target
            if (target.className.indexOf("ace_gutter-cell") == -1)
                return

            // allow setting breakpoints only on the left side of editor gutter
            if (e.clientX > 25 + target.getBoundingClientRect().left)
                return

            let breakpointsTemp = e.editor.session.getBreakpoints(rowNumber, 0)

            var rowNumber = e.getDocumentPosition().row  // row = current line number


            if(breakpointsTemp[rowNumber] === undefined && isBreakpointPlaceableAtRow(rowNumber)) {
                breakpoints.setBreakpoint(rowNumber)
            }
            else {
                breakpoints.clearBreakpoint(rowNumber)
            }
            e.stop()

            // breakpoints.setAce(e.editor.session.getBreakpoints())
        })

        /**
         * watch code changes and move breakpoints to the correct place (or delete breakpoints)
         * modified https://github.com/ajaxorg/ace/issues/1282, works for multiple breakpoints
         */

        editor.on("change", function (e) {
            if (editorFocused) {  // IMPORTANT, we want to respond only code changes made by user. If projects is switched and code changes, don't run this code.
                if (e.lines.length > 1 && (e.action==='insert' || e.action==='remove')){
                    const amountOfLinesAffected = e.lines.length - 1
                    const startRow = e.start.row
                    const endRow = e.end.row

                    const oldBreakpointsSet = breakpoints.get()
                    let newBreakpointsSet = new Set()

                    for (const breakpointRow of oldBreakpointsSet) {
                        if (e.action==='insert') {  // new lines
                            if (breakpointRow > startRow ){
                                // breakpoint forward
                                newBreakpointsSet.add(breakpointRow + amountOfLinesAffected)
                            }
                            else {
                                // unaffected by insert
                                newBreakpointsSet.add(breakpointRow)
                            }
                        }
                        else if (e.action==='remove') {  // removed lines
                            if (breakpointRow > startRow && breakpointRow <= endRow ){
                                // breakpoint removed
                            }
                            else if (breakpointRow >= endRow ){
                                // breakpoint behind
                                newBreakpointsSet.add(breakpointRow - amountOfLinesAffected)
                            }
                            else {
                                // unaffected by remove
                                newBreakpointsSet.add(breakpointRow)
                            }
                        }
                    }
                    breakpoints.set(newBreakpointsSet)
                }

                // check for useless breakpoints (on empty or incorrect lines (with syntax error) = unreachable lines) and remove them
                setTimeout(()=> {   // setTimeout is needed, it doesn't work immediately
                    let breakpointsSet = breakpoints.get()

                    for (const rowNumber of breakpointsSet) {
                        if (!isBreakpointPlaceableAtRow(rowNumber)) {
                            breakpoints.clearBreakpoint(rowNumber)
                        }
                    }
                }, 100)
            }
        })





        // run annotate function first time after load
        setTimeout(()=>annotate(editor, $code), 2000)


        let currentMarker

        unsubscribeCurrentlyExecutedLine = currentlyExecutedLine.subscribe(lineNumber => {
            if(currentMarker) {  // remove marker if it exists
                // https://stackoverflow.com/questions/33324361/ace-editor-cant-get-rid-of-marker
                editor.session.removeMarker(currentMarker)
            }

            let from = lineNumber
            let to = lineNumber
            const Range = ace.acequire('ace/range').Range
            currentMarker =  editor.session.addMarker(new Range(from, 0, to, 1), "ace_current_line", "fullLine")



            if (!editorFocused) {
                if ($settings.codeExecutionScroll) {
                    editor.scrollToLine(lineNumber, true, true, function () {})
                }
            }
        })



    }

    // debounce annotate function - don't interrupt user while he is typing. Show/update errors only when user stops typing the code
    // const debouncedAnnotate = debounce(() => annotate(editor, $code), 400)
    const debouncedAnnotate = debounce(() => annotate(editor, $code), 0)


    $: console.log("breakpoints", $breakpoints)
    onDestroy(() => {
        unsubscribeCurrentlyExecutedLine()
        unsubscribeBreakpoints()
    });

</script>

<style>
    :global(.ace_breakpoint) {
        position: relative;
        background-color: rgba(139, 0, 0, 0.33);
    }

    /*draw a circle https://stackoverflow.com/a/6937010/14409632*/
    :global(.ace_breakpoint:before) {
        cursor: pointer;
        position: absolute;
        color: red;
        content: '\25CF';
        font-size: 30px;
        top: -10px;
        left: 2px;
    }

    :global(.ace_current_line) {
        position:absolute;
        background: var(--register-ip);
        opacity: .5;
        z-index:20
    }
    :global(.ace_error_line) {
        position:absolute;
        background: rgba(200, 100, 123, 0.5);
        z-index:20
    }

    /* fixes shaking while code is executed - because empty gutter (line number legend) has different size*/
    :global(.ace_gutter-layer) {
        min-width: 60px !important;
    }

    /* fixed ace-dracula theme bug, where selection is not visible */
    :global(.ace-dracula .ace_marker-layer .ace_selection) {
        background: #214283 !important;}
</style>


<div>
    <b>{$_('views.modules.codeEditor')}:</b>

    <!--TODO: fix cut copy paste - https://stackoverflow.com/questions/59998538/cut-and-paste-in-ace-editor-->
    <!--https://github.com/nateshmbhat/svelte-ace-->
    <AceEditor
            on:selectionChange={(obj) => console.log(obj.detail)}
            on:paste={(obj) => editor.execCommand("paste", obj.detail)}
            on:input={(obj) => debouncedAnnotate(obj.detail)}
            on:focus={() => editorFocused = true}
            on:documentChange={(obj) => console.log(`document change : ${obj.detail}`)}
            on:cut={() => editor.execCommand("cut")}
            on:cursorChange={() => console.log('cursor change')}
            on:copy={() => {}}
            on:init={(editor) => init(editor.detail)}
            on:commandKey={(obj) => console.log(obj.detail)}
            on:changeMode={(obj) => console.log(`change mode : ${obj.detail}`)}
            on:blur={() => editorFocused = false}
            width='100%'
            height='85vh'
            lang="assembly_x86"
            bind:theme={theme}
            bind:value={$code}
    />
</div>



