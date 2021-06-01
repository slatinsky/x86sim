import {writable} from "svelte/store";

import {Registers} from "./registers"
import {CurrentlyExecutedLine} from "@stores/currentlyExecutedLine";
import {Programs, projectName} from "./programs"
import {Memory} from "./memory"
import {code, debugMode} from "@compiler/codeRunner";
import {opcodes} from "@compiler/opcodes";

export const registers = new Registers();
export const currentlyExecutedLine = new CurrentlyExecutedLine(registers)
export const memory = new Memory(registers);

export const programs = new Programs();

export {projectName, code, debugMode, opcodes}
export {settings} from "./settings"
export {appState} from "./appState"

export let keycodes = writable([])

