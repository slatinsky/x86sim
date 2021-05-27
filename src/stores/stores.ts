import { throttle } from 'lodash-es';

import {registers} from "./registers"


import {programs, projectName} from "./programs"


import {memory} from "./memory"
import {writable} from "svelte/store";
import { currentlyExecutedLine } from '@compiler/compileParseTree';
import {code, debugMode} from "@compiler/codeRunner";
import {opcodes} from "@compiler/opcodes";



// note: code in this file runs only one



export {registers, memory, programs, projectName, code, currentlyExecutedLine, debugMode, opcodes}
// export {registers, memory, programs, projectName, code, currentlyExecutedLine, compiledInstructions, debugMode, programIsRunning}
// export {registers, memory, programs, projectName, currentlyExecutedLine}
export {settings} from "./settings"
export {appState} from "./appState"

export let keycodes = writable([])

