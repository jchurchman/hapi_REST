const restify = require('restify');
const app = restify.createServer();
const errorHandler = require('./error-handler')();

const musicians = require('./rutes/musicians');

app.use('/musicians', musicians);

app.use(errorHandler);

module.exports = app;