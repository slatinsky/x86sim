# x86sim

Simulator of x86 intel computer in the real mode.

Made in [svelte](https://svelte.dev/) - [sveltejs/component-template](https://github.com/sveltejs/component-template)*

## development
### first setup
- Make sure you have [Node.js](https://nodejs.org) and git installed.
- run inside empty directory command `git clone https://github.com/slatinsky/sim .`. This will clone all project files inside that directory.
- to install dependencies, run `npm i` 

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

### repeated setup
To start [Rollup](https://rollupjs.org) development server in live reloading mode, run `npm dev`. Then navigate to [localhost:5000](http://localhost:5000) in your browser. If you make any changes in `src`, page will be automatically reloaded.



## production
To create optimized production build, compile using `npm run build`. After compilation, production build will be created inside `public` folder. Upload it's content to your web server. Only static files are generated, so it will work in almost any server which serves static files, for example [apache](https://httpd.apache.org/). 

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv) dependency.


