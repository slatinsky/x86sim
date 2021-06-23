
## Building from the source - more detailed guide
### Development environment
#### First setup
- Make sure you have [Node.js](https://nodejs.org) and git installed.
- run inside empty directory command `git clone https://github.com/slatinsky/x86sim .`. This will clone all project files inside that directory.
- to install dependencies, run `npm i`

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/), installation of the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) is recommended. If you are using other editors you may need to install a plugin in order to get syntax highlighting and IntelliSense.

If you are using IDE from JetBrains and indexing is slow -> right-click `public/build folder` -> `mark directory as` -> `Excluded`

#### Starting development server
To start [Rollup](https://rollupjs.org) development server in live reloading mode, run `npm run dev`. Then navigate to [localhost:5000](http://localhost:5000) in your browser. If you make any changes in `src`, page will be automatically reloaded.


#### Service worker is disabled in development builds or localhost
To make builds quicker, service worker is disabled:
- if you are on localhost
- or in development builds

To debug service worker, change `USE_SERVICE_WORKER` variable in `rollup.config.ts` and using [hosts](https://en.wikipedia.org/wiki/Hosts_(file)) file access localhost under a different domain

### Production
To create an optimized production build, compile using `npm run build`. After compilation, the production build will be created inside the `public` folder. Upload its content to your web server. Only static files are generated, so it will work in almost any server which serves static files, for example, [apache](https://httpd.apache.org/).

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv) dependency.

## Tests
Tests use `Mocha` testing library.

### Running tests
To run tests, run `npm run test` in command line (shorter `npm t`)

### Creating new test
For example, if you have a file named `exampleFileName.ts` inside `src/` folder, create `exampleFileName.spec.ts` file. All `.spec.ts` files will be run if you run tests.



## Simulator architecture documentation
### Split logic (compiler) and views
The Simulator is split into two parts:
1) compiler (Typescript)
2) views (Svelte)

The idea is that the graphical user interface can be replaced at any time if needed without the need to modify the core application logic.

### How to implement new instruction
To implement new instruction:
1) create new file in `src/compiler/opcodes/[OPCODE_NAME].ts` and copy the closest existing opcode definition file.
2) implement it - use already implemented instructions as an inspiration
3) import it inside `src/compiler/opcodes/index.ts` and add it to the `opcodes` object
4) If rollup throws an error after adding a new .ts file - restart it.

Example of `pop.ts` instruction:
```javascript
// Import pre made code, that handles reading and setting values from and to registers and memory.
// If you need to access stack, modify it using memory object, because stack and data memory is shared.
import {registers, memory} from "@stores";

// pops value from stack
export default  {
    // hint to the code editor, which values is expected the function to modify
    // available values (must be lowercase):
    // writesTo: ['operand1']
    // writesTo: []             // if it doesn't write to anything - for example nop
    // writesTo: ['ip']         // if it is jump. If it contains 'ip', ip register isn't autoincremented after instruction execution
    writesTo: ["operand1"],

    // if instruction uses two operands, change signature to
    // run: (operand1, operand2) => {

    // if instruction uses zero operands, change signature to
    // run: () => {
    run: (operand1) => {
        // get value of stack pointer register (sp)
        let sp = registers.get('sp')
        let address = (registers.get('ss') << 4) + sp

        // using the address, read value from stack
        let valueFromStack = memory.get(address, 16)

        // if the instruction signature is for example 'POP AX', operand1 will contain 'pointer' to AX register. but it also can be direct or indirect memory address, for example '[ax-4]'
        // setting this value will set that value passed in. If user passed in AX register, AX register will be changed. If user passed in '[ax-4]', the memory cell at the address of AX-4 will be set.
        // if the instrution you are implementing is an arithmetic instruction, use operand1.setWithFlags(value) instead - it will update the flag register
        // if you use operand1.set(value), flag register will stay untouched
        operand1.set(valueFromStack)
        memory.set(address, 0, 16)
        registers.set('sp', sp + 2)
    },
}
```
