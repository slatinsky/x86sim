# ![x86sim](public/assets/128.png?raw=true "x86sim") x86sim


---

Simulator of x86 intel computer in a 16-bit real mode made for education purposes.

Made in [svelte](https://svelte.dev/) - [sveltejs/component-template](https://github.com/sveltejs/component-template)

## Demo
You can try the simulator [on this page](http://slatinsky.github.io/x86sim/index.html)

## Features
- code editor
    - breakpoints
    - autocomplete
    - error checking
    - autosave, no need to manually save the project
- registers editor
    - implemented general-purpose registers (AX, BX, CX, DX), segment registers (CS, DS, SS, ES), flags (parity, zero, sign, overflow)
- memory editor
    - memory size 1 MB (so segment registers need to be used) - same as the largest memory addressable by Intel 8086
- stack segment (different view to the same memory)
- keyboard
    - read status (if keyboard has available input) at port 0x64
    - read input byte at port 0x60
- screen (text graphics adapter)
    - colors
    - memory-mapped from address 0xb8000
- running the code
    - infinite loop detection (simulator won't "freeze")
    - "instant" code executions or animated (delayed) code execution
    - follow IP register setting
    - ability to undo code execution ("step back" and "run backwards")
    - debugging mode - changes to registers, memory, and keyboard buffer are restored to the state before the "debugging mode"
- help and tutorial
  - 22 included tutorial projects
  - Guide directly inside simulator
- all projects saved in the browsers (permanent) localStorage
    - all projects can be exported as ZIP/JSON
    - exported projects can be imported by drag & drop to the window of the simulator
- English and Slovak internationalization
- Dark theme :)
- Speed
- Offline support using service worker (index.html can't be inside a subfolder of the webserver, subdomain is ok)

## Limitations
- Variable-length instructions are not implemented (every instruction is 1 byte in length, but shouldn't be. x86 instructions can be up to 15 bytes in length)
- compiled assembly code cannot be seen inside the main memory
- not all flags from the flag register are implemented (missing carry flag, ac, ...)
- limited amount of implemented instructions
- doesn't work on touch devices ("ace" code editor needs to be updated, provide an alternative for drag & drop to import projects to the simulator)

## Future plans
- Translate built-in guide to English
- Add support for touch devices
- Implement carry flag
- Implement ability to run multiple instances of application logic



## Building from source
### First setup
- `git clone https://github.com/slatinsky/x86sim`
- `cd x86sim`
- `npm i`

### Development build
- `npm run dev`
- you are now ready to modify the code. The browser will be automatically reloaded
- if you add a new typescript file, you may need to restart `npm run dev`

### Production build
to create optimized production build including service workers for offline support:
- `npm run build`
- copy files from the `public` folder to your webserver

### Running tests
- `npm t`
- all `.spec.ts` files are test files

[More in-depth development environment guide](docs/development.md)

---
Found a bug? [Please create an issue](https://github.com/slatinsky/x86sim/issues)

---


![x86sim](public/assets/help/beginning/snake.png?raw=true "x86sim")
