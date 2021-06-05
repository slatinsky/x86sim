import {writable} from "svelte/store";

import {Registers} from "./registers"
import {Programs, projectName} from "./programs"
import {Memory} from "./memory"
import {opcodes} from "@compiler/opcodes";
import {CodeRunner} from "@compiler/codeRunner";
import {Settings} from "@stores/settings";

export const settings = new Settings();
export const registers = new Registers();
export const memory = new Memory(registers);
export const codeRunner = new CodeRunner(registers, settings)

export const code = codeRunner.code
export const debugMode = codeRunner.debugMode
export const codeRunnerStatus = codeRunner.status
export const executedInstructionsCount = codeRunner.snapshots.executedInstructionsCount
export const differences = codeRunner.snapshots.differences
export const breakpoints = codeRunner.breakpoints
export const lineAddressMapping = codeRunner.lineAddressMapping
export const currentlyExecutedLine = codeRunner.currentlyExecutedLine


export const programs = new Programs();

export {projectName, opcodes}
export {appState} from "./appState"

export let keycodes = writable([])

