'use strict';

var http = require('http');
const fs = require('fs');

const configFileOptions = { encoding: 'utf8' };

let configFile = getConfigFile(process.argv); 

let config = undefined;

if (configFile) {
    fs.exists(configFile, exists => {
        if (!exists) {
            process.exit(1);
        }
    });

    const fileContents = fs.readFileSync(configFile, configFileOptions);
    config = JSON.parse(fileContents);
} else {
    process.exit(1);
}

console.log(config);

http.createServer((req, res) => {
	
	var header=req.headers['authorization']||'';
	
	if (header.length === 0) {
		res.statusCode = 401
		res.setHeader('WWW-Authenticate', 'Basic realm="task-service"');
		res.end('Access denied');
	} else {

   		var	token=header.split(/\s+/).pop()||'',            // and the encoded auth token
      	auth=new Buffer.from(token, 'base64').toString(),    // convert from base64
      	parts=auth.split(/:/),                          // split on colon
      	username=parts[0],
      	password=parts[1];

		res.writeHead(200, { 'Content-Type': 'text/plain' })
   		res.end('Username: ' + username + '; Password: '+ password);
   	}
}).listen(1337);

function getConfigFile(args) {

	const configParam = '--ConfigurationFile=';
	let configFile = undefined;
	args.forEach((arg) => {
		configFile = arg.startsWith(configParam) 
		? arg.slice(configParam.length) 
		: configFile;
	})
	return configFile;
}