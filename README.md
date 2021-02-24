# x86realSim

Simulator of x86 intel computer in the real mode.

Made in [svelte](https://svelte.dev/) - [sveltejs/component-template](https://github.com/sveltejs/component-template)

## Installation guide
### Development environment
#### First setup
- Make sure you have [Node.js](https://nodejs.org) and git installed.
- run inside empty directory command `git clone https://github.com/slatinsky/sim .`. This will clone all project files inside that directory.
- to install dependencies, run `npm i` 

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/), installation of the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) is recommended. If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

#### Starting development server
To start [Rollup](https://rollupjs.org) development server in live reloading mode, run `npm run dev`. Then navigate to [localhost:5000](http://localhost:5000) in your browser. If you make any changes in `src`, page will be automatically reloaded.



### Production
To create optimized production build, compile using `npm run build`. After compilation, production build will be created inside `public` folder. Upload it's content to your web server. Only static files are generated, so it will work in almost any server which serves static files, for example [apache](https://httpd.apache.org/). 

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv) dependency.

## Design choices
Stack and data memory shares the same memory region. Stack is at the end of the memory.

## Simulator architecture documentation
### Split logic (compiler) and views
Simulator is split into two parts:
1) compiler
2) views
3) controller layer between the compiler and views is planned

The idea is that the graphical user interface can be replaced at any time if needed without the need to modify the core compiler.

### Modular opcode definitions
Simulator was made with extensibility in mind. 

To add new instruction:
1) create new file in `src/compiler/opcodes/[OPCODE_NAME].ts` and copy the closest existing opcode definition file.
2) implement it - use already implemented instructions as an inspiration
3) import it inside `src/compiler/opcodes/index.ts` and add it to `opcodes` object
4) If rollup throws error after adding new .ts file - restart it.

Example of `pop.ts` instruction:
```javascript
// Import pre made code, that handles reading and setting values from and to registers and memory.
// If you need to access stack, modify it using memory object, because stack and data memory is shared.
import {registers, memory} from "../../stores/stores";

export default  {
    // hint to the code editor, which values is expected the function to modify
    // available values (must be lowercase):
    // writesTo: ['operand1']
    // writesTo: []             // if it doesn't write to anything - for example nop
    // writesTo: ['ip']         // if it is jump
    writesTo: ['operand1'],

    // if instruction uses two operands, change signature to
    // run: (operand1, operand2) => {

    // if instruction uses zero operands, change signature to
    // run: () => {
    run: (operand1) => {        
        // get value of stack pointer register (sp)
        let sp = registers.get('sp')

        // using stack pointer register, read value from stack
        let valueFromStack = memory.get(sp)

        // if the instruction signature is for example 'POP AX', operand1 will contain 'pointer' to AX register. but it also can be direct or indirect memory address, for example '[ax-4]'
        // setting this value will set that value passed in. If user passed in AX register, AX register will be changed. If user passed in '[ax-4]', the memory cell at the address of AX-4 will be set.
        operand1.set(valueFromStack)

        // set the memory at the address of 'sp' to zero
        memory.set(sp, 0)

        // set 'sp' register to sp+1
        registers.set('sp', sp + 1)

        // increment ip register
        registers.inc('ip')
    },
}
```

### Save file format
This part of the documentation talks about the save format used.

#### Format

Example of the format
```json
{
    "version":1,
    "name":"a",
    "registers":{"ip":18,"ax":21,"bx":6,"sp":32,"bp":32},
    "memory":{},
    "code":"inc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\ninc ax\r\n"
}
```

- `version` is version of the saved format. It is used to ensure, that future versions of the simulator can safely migrate the file to new format.
- `name` is the user defined name of the program
- `registers` contains all non zero registers
- `memory` contains all non zero memory addresses used
- `code` contains assembly code written by user. New lines are delimeted by `\n`

#### Autosave
Currently opened program is autosaved to `localStorage.autosave` every 2 seconds

On simulator load, `localStorage.autosave` is checked if exists. If exists, it is loaded. Else simulator loads default values.


## Bugs
- rapidly switching between projects causes autosave to save to the wrong project

## Ideas
parse constants ending with `h` or begining with `0x` as hex
better parsing error messages
