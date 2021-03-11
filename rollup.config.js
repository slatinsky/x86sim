import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import { string } from "rollup-plugin-string";
import strip from '@rollup/plugin-strip';
import json from '@rollup/plugin-json';
const { generateSW } = require('rollup-plugin-workbox');  // https://www.npmjs.com/package/rollup-plugin-workbox

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess(),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
		string({  // https://www.npmjs.com/package/rollup-plugin-string
			// Required to be specified
			include: "**/*.md",

			// Undefined by default
			exclude: ["**/index.html"]
		}),


		// plugin to import json files in js
		json(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		// strip console logs in production to increase performance
		// console errors are not stripped, because they are not as frequent and may be needed
		production && strip({
			// documentation: https://github.com/rollup/plugins/tree/master/packages/strip
			include: [  // include - incompatibility fix for svelte https://github.com/rollup/plugins/issues/42
				'**/*.js',
				'**/*.ts',
				'**/*.svelte',
			],
			functions: [
				'console.log',
			],
		}),

		generateSW({
			globPatterns: ["**/*.{jpg,png,html,js,css,json}"],
			swDest: 'public/sw.js',
			globDirectory: 'public/',
			// handler: 'staleWhileRevalidate'
		})
	],
	watch: {
		clearScreen: false
	}
};
