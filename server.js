const restify = require('restify');

const server = restify.createServer();

server.connection({ port: 3000, host: 'localhost'});

server.start((err) => {

    if(err) { throw err; }

    console.log(`Server running at: ${server.info.uri}`);
});

module.exports = server;