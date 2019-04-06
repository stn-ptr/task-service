'use strict';

var http = require('http');

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