import {tokenize} from "@compiler/tokenizer";
import {createParseTree} from "@compiler/createParseTree";
import {validateParseTree} from "@compiler/validateParseTree";
import {compileParseTree} from "@compiler/compileParseTree";
import {writable} from "svelte/store";
import type {iCompiledInstruction, iError, iRow, iToken} from "@compiler/types";

export interface iCompilerOutput {
    tokens: iToken[],
    parseTree: iRow[],
    instructionsCompiled: iCompiledInstruction[],
    errors: iError[]
}

export class Compiler {
    public lineAddressMapping
    public parseTree

    constructor() {
        this.lineAddressMapping = writable<{ [key: number]: number }>({})
        this.parseTree = writable([])
    }

    /**
     * creates object that maps ip register and editor line, so editor can display expected ip register in line gutter
     *
     * lineAddressMapping:
     *      key = editor row
     *      value = ip register
     *
     * example:
     * {2: 0, 4: 1, 5: 2, 6: 3, 7: 4}

     */
    private updateLineAddressMapping(instructionsCompiled: iCompiledInstruction[]) {
        let newLineAddressMapping: { [key: number]: number } = {}
        // console.log("this.instructionsCompiled", instructionsCompiled)
        for (const [ip, instructionCompiled] of Object.entries(instructionsCompiled)) {
            let editorRow = instructionCompiled.instruction.opcode.row
            newLineAddressMapping[editorRow] = parseInt(ip)
        }
        this.lineAddressMapping.set(newLineAddressMapping)
    }

    public compile(updatedCode: string): iCompilerOutput {
        let tokens = tokenize(updatedCode)
        let [rowsNew, errorsNew] = createParseTree(tokens)
        let errorsNew2
        [errorsNew2, rowsNew] = validateParseTree(rowsNew)

        this.parseTree.set(rowsNew)

        let [instructionsNewCompiled, errorsNew3] = compileParseTree(rowsNew)
        this.updateLineAddressMapping(instructionsNewCompiled)

        return {
            tokens: tokens,
            parseTree: rowsNew,
            instructionsCompiled: instructionsNewCompiled,
            errors: [].concat(errorsNew).concat(errorsNew2).concat(errorsNew3)
        }
    }
}

