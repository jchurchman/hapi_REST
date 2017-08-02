const restify = require('restify');

const server = restify.createServer();

server.listen( 3000, (err) => {

    if(err) { throw err; }

    console.log(`Server running at: ${server.url}`);
});

module.exports = server;