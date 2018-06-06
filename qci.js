#! /usr/bin/env node
const repl = require('repl'),
	fs = require('fs');

// don't worry about how long it took 
// to get the escape characters right
// it was worth it.
const banner = `----------------------------------------------
 _____ _ _ _      _____                  _____       __                                 _   
|  _  | (_) |    /  __ \\                |_   _|     / _|                               | |  
| | | | |_| | __ | /  \\/ ___  _ __ ___    | | _ __ | |_ ___  _ __ _ __ ___   __ _ _ __ | |_ 
| | | | | | |/ / | |    / _ \\| '__/ _ \\   | || '_ \\|  _/ _ \\| '__| '_ \` _ \\ / _\` | '_ \\| __|
\\ \\/' / | |   <  | \\__\/\\ (_) | | |  __/  _| || | | | || (_) | |  | | | | | | (_| | | | | |_ 
 \\_\/\\_\\_|_|_|\\_\\  \\____/\\___/|_|  \\___|  \\___/_| |_|_| \\___/|_|  |_| |_| |_|\\__,_|_| |_|\\__|

type ".help" and press <enter> to get started
----------------------------------------------
`;

console.log(banner);

const replServer = repl.start({ 
	prompt: `(qci)> `,
	useGlobal: false
});

const loadCommands = (dir) => {
	return fs.readdir(dir, (err, files) => {
		return files.forEach(file => {
			if(file === 'template.js') return;
			require(`${dir}/${file}`)(replServer);
		});
	});
};

loadCommands(`${__dirname}/commands/core`);
loadCommands(`${__dirname}/commands/custom`);
