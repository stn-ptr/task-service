'use strict';

var https = require('https');
var fs = require('fs');

var configFileOptions = { encoding: 'utf8' };

var configFile = getConfigFile(process.argv); 

var config = undefined;

if (configFile) {
    fs.exists(configFile, function(exists) {
        if (!exists) {
            process.exit(1);
        }
    });

    var fileContents = fs.readFileSync(configFile, configFileOptions);
    config = JSON.parse(fileContents);
} else {
    process.exit(1);
}

var httpOptions = {
    key: fs.readFileSync(config.HttpsOptions.key),
    cert: fs.readFileSync(config.HttpsOptions.cert)
};

https.createServer(httpOptions, function (req, res) {
	
	var header=req.headers['authorization']||'';
	
	if (header.length === 0) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="task-service"');
		res.end('Access denied');
	} else {
		var	token = header.split(/\s+/).pop() || '';
		var auth = new Buffer(token, 'base64').toString();
		var parts = auth.split(/:/);
		var username = parts[0];
		var password = parts[1];

		res.writeHead(200, { 'Content-Type': 'text/plain' });
   		res.end('Username: ' + username + '; Password: '+ password);
   	}
}).listen(1337);

function getConfigFile(args) {

	var configParam = '/--ConfigurationFile=/';
	var configFile = undefined;
	args.forEach(function(arg) {
		configFile = arg.search(configParam) 
		? arg.slice(configParam.length - 2) 
		: configFile;
	})
	return configFile;
}