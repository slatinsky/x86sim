# ![x86sim](public/assets/128.png?raw=true "x86sim") x86sim

---

Simulator of x86 intel computer in the real mode.

Made in [svelte](https://svelte.dev/) - [sveltejs/component-template](https://github.com/sveltejs/component-template)


## User guide
### Code editor
**Keybings**
https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts

### Added functionality to code editor
Add/remove breakpoint by clicking next to line number

### Memory editor
**Keybings**

 - ArrowDown ArrowUp ArrowLeft ArrowRight -> change currently edited memory adress using keyboard
 - Delete -> set current memory cell to zero and move to next address
 - Escape -> exits from exitation mode
 - Backspace -> removes the least significant digit and shifts the value by one character
 - [0-9a-f] -> change value. Moves automatically to the next memory address if necessary

---

## Installation guide
### Development environment
#### First setup
- Make sure you have [Node.js](https://nodejs.org) and git installed.
- run inside empty directory command `git clone https://github.com/slatinsky/sim .`. This will clone all project files inside that directory.
- to install dependencies, run `npm i` 

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/), installation of the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) is recommended. If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

If you are using ide from jetbrains and indexing is slow -> right click `public/build folder` -> `mark directory as` -> `Excluded`

#### Starting development server
To start [Rollup](https://rollupjs.org) development server in live reloading mode, run `npm run dev`. Then navigate to [localhost:5000](http://localhost:5000) in your browser. If you make any changes in `src`, page will be automatically reloaded.


#### Service worker is disabled in development builds or localhost
To make builds quicker, service worker is disabled:
- if you are on localhost
- or in development builds

To debug service worker, change `USE_SERVICE_WORKER` variable in `rollup.config.ts` and using [hosts](https://en.wikipedia.org/wiki/Hosts_(file)) file access localhost under different domain

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
    // writesTo: ['ip']         // if it is jump. If it contains 'ip', ip register isn't autoincremented after instruction execution
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
        // if the instrution you are implementing is an arithmetic instruction, use operand1.setWithFlags(value) instead - it will update the flag register
        // if you use operand1.set(value), flag register will stay untouched
        operand1.set(valueFromStack)

        // set the memory at the address of 'sp' to zero
        memory.set(sp, 0)

        // set 'sp' register to sp+2
        registers.set('sp', sp + 2)

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
- autosave not saving registers after reset
- second stack update (push then pop) doesn't show in stack window - jumps to zero

# todo
- better project object upgrades
- add stack back using virtual memory - show only stack segment inside
- push to stack / pop only 16 bit values - in validation
- support binary numeric format 10b   (b ending)
- multitab support
- labels can be on the same line
- validate if 'ah' is correctly handled as register, not as 0xa hex value. Register should have higher priority
- instruction history is weird, it isn't cleared correctly sometimes - there is bug somewhere
- add validation warning if trying to write to memory cell and 8/16bit info is unknown in that instruction
- verify if push and pop always gets 16-bit value
- verify labels in verification step
- merge ace editor tokenizer with our tokenizer. Stop using built in assembly tokenizer 
- test uppercase/mixed case code, not everything is converted to lowercase correctly yet  
- if bit size is not know, autodetect the size during memory write instead of converting it to 8-bit only
- add #define MACRO_NAME macros
- add recovery if error is found during compilation - compile again without problematic line


# validation todo
- mov alphanumeric, 5

## Ideas
parse constants ending with `h` or begining with `0x` as hex
better parsing error messages
