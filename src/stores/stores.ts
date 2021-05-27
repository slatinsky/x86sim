import {registers} from "./registers"
import {Programs, projectName} from "./programs"

import {currentlyExecutedLine} from "@stores/currentlyExecutedLine";
export {currentlyExecutedLine}

import {Memory} from "./memory"
import {writable} from "svelte/store";
import {code, debugMode} from "@compiler/codeRunner";
import {opcodes} from "@compiler/opcodes";



export const memory = new Memory();
export const programs = new Programs();


export {registers, projectName, code, debugMode, opcodes}
export {settings} from "./settings"
export {appState} from "./appState"

export let keycodes = writable([])

