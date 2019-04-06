'use strict';

var http = require('http');

http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Node.js server is running');
    }).listen(1337);