import {writable} from "svelte/store";

import {Registers} from "./registers"
import {CurrentlyExecutedLine} from "@stores/currentlyExecutedLine";
import {Programs, projectName} from "./programs"
import {Memory} from "./memory"
import {opcodes} from "@compiler/opcodes";
import {CodeRunner} from "@compiler/codeRunner";

export const registers = new Registers();
export const memory = new Memory(registers);
export const currentlyExecutedLine = new CurrentlyExecutedLine(registers)
export const codeRunner = new CodeRunner()
export const code = codeRunner.code
export const debugMode = codeRunner.debugMode
export const codeRunnerStatus = codeRunner.status
export const executedInstructionsCount = codeRunner.snapshots.executedInstructionsCount
export const differences = codeRunner.snapshots.differences


export const programs = new Programs();

export {projectName, opcodes}
export {settings} from "./settings"
export {appState} from "./appState"

export let keycodes = writable([])

