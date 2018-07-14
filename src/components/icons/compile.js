
/*
	run script:
	$ node compile
*/

const fs = require('fs');
const { resolve } = require('path');
const SVGO = require('svgo')

const ICON_DIR = resolve(__dirname, 'raw');
const OUTPUT_FILENAME = resolve(__dirname, 'index.jsx');


class SVGOptimize {
	constructor(iconDir, outputFilename){
		this.iconDir = iconDir;
		this.outputFilename = outputFilename;

		this.stream = null;

		this.optimize();
	}

	_genConfig(opts = {}) {
		const plugins = [
			{ removeTitle: true },
			{ removeViewBox: false }
		];
		if (opts.removeColors) {
			plugins.push({
				removeAttrs: {
					attrs: '*:(fill|stroke)',
				}
			})
		}
		return new SVGO({
			plugins: plugins
		});
	}

	async optimize(){
		const svgo = this._genConfig({ removeColors: true })

		try {
			await this.createJSX(OUTPUT_FILENAME)

			// optimize each icon in directory
			const toOptomize = fs.readdirSync(ICON_DIR)
				.filter(f => f.match(/\.svg$/))
				.map(filename => {
					return this.optimizeSVG(ICON_DIR, filename, svgo)
				})

			// wait for all svgs to finish optimizing
			try {
				const d= await Promise.all(toOptomize)
				// console.log( 'all done as', d);
				// console.log(`Finished optimizing icons`);
				this.stream.end();
			} catch (err) {
				console.error('Error optimizing svgs', err)
				this.stream.end(err);
			}

		} catch (err) {
			console.error('Something went wrong', err);
		}
	}

	createJSX(file) {
		return new Promise(res => {
			fs.openSync(file, 'w')
			const stream = fs.createWriteStream(file)
			this.stream = stream;
			
			stream.on('open', () => {
				stream.write(`import React from 'react';\n`)
				res();
			})

			stream.on('error', err =>  {
				console.error('Stream failed!', err);
			})
		})
	}

	async optimizeSVG(filedir, filename, svgo) {
		const filepath = resolve(filedir, filename);
		const file = await read(filepath);

		const { data } = await svgo.optimize(file)
		const formatted = this.formatSVG(filename, data)

		await write(this.stream, formatted)
	}

	formatSVG(filename, data) {
		// remove material design icon backgrounds
		data = data.replace('<path d="M0 0h24v24H0z"/>', '').replace('<path d="M0-.75h24v24H0z"/>', '');

		// add react class
		data = data.replace(/^<svg/, '<svg className={className}');

		// generate icon name`
		let icon = filename.replace(/-|_/gi, '').replace('.svg', '');
		if (icon.match('-')) {
			console.log(filename);
		}
		icon = icon.charAt(0).toUpperCase() + icon.slice(1)

		// template svg data
		return `
export const ${icon} = ({className}) => (
	${data}
)\n`
	}
}

// start
new SVGOptimize(ICON_DIR, OUTPUT_FILENAME)


/************
	Helpers
*************/

function read(filepath){
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, {
			encoding: 'utf-8'
		}, (err, data) => {
			if (err) {
				return reject(err)
			}
			resolve(data)
		})
	})
}

function write(stream, data){
	return new Promise((resolve, reject) => {
		stream.write(data, err => {
			if (err){
				return reject(err)
			}
			resolve();
		})
	})
}

