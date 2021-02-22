import { throttle } from 'lodash-es';
import {writable} from "svelte/store";
import {code, currentlyExecutedLine, compiledInstructions} from "../compiler/compiler"
import {programs, projectName} from "./programs"
import {registers} from "./registers"
import {memory} from "./memory"

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

export {registers, memory, programs, projectName, code, currentlyExecutedLine, compiledInstructions}
export {settings} from "./settings"
export {appState} from "./appState"

