import {registers} from "./registers"
import {Programs, projectName} from "./programs"

import {Memory} from "./memory"
import {writable} from "svelte/store";
import { currentlyExecutedLine } from '@compiler/compileParseTree';
import {code, debugMode} from "@compiler/codeRunner";
import {opcodes} from "@compiler/opcodes";

const memory = new Memory();
const programs = new Programs();


export {registers, memory, programs, projectName, code, currentlyExecutedLine, debugMode, opcodes}
export {settings} from "./settings"
export {appState} from "./appState"

export let keycodes = writable([])

