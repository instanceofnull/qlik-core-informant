#! /usr/bin/env node
const repl = require('repl'),
	fs = require('fs');

const banner = `
----------------------------------------------
Qlik Core Informant

type ".help" and press <enter> to get started
----------------------------------------------
`;

console.log(banner);

const replServer = repl.start({ 
	prompt: `(qci)> `,
	useGlobal: false
});

const loadCommands = (dir) => 
	fs.readdir(dir, (err, files) => 
		files.forEach(file => require(`${dir}/${file}`)(replServer)));

loadCommands(`${__dirname}/commands/core`);
loadCommands(`${__dirname}/commands/custom`);
