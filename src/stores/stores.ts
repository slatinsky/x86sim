import { throttle } from 'lodash-es';
// import {code, compiledInstructions, debugMode, programIsRunning} from "../compiler/compiler"
import {programs, projectName} from "./programs"
import {registers} from "./registers"
import {memory} from "./memory"
import {writable} from "svelte/store";
import { currentlyExecutedLine } from '../compiler/compileParseTree';
import {code, debugMode} from "../compiler/codeRunner";
import {opcodes} from "../compiler/opcodes";




// note: code in this file runs only one


// load autosaved project
programs.loadCurrentProject()


// autosave currently opened project
const throttledSaveCurrentProject = throttle(programs.saveCurrentProject, 1000);  // 1 sec throttle
code.subscribe(updatedCode => {
    throttledSaveCurrentProject()
});
registers.subscribe(_ => {
    throttledSaveCurrentProject()
});
memory.subscribe(_ => {
    throttledSaveCurrentProject()
});
export {registers, memory, programs, projectName, code, currentlyExecutedLine, debugMode, opcodes}
// export {registers, memory, programs, projectName, code, currentlyExecutedLine, compiledInstructions, debugMode, programIsRunning}
// export {registers, memory, programs, projectName, currentlyExecutedLine}
export {settings} from "./settings"
export {appState} from "./appState"

export let keycodes = writable([])

