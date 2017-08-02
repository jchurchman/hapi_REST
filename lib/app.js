const restify = require('restify');
const server = restify.createServer();
const errorHandler = require('./error-handler')();
const Musician = require('./models/musician');
const jsonParser = require('body-parser').json();
// const musicians = require('./routes/musicians');

server.use(jsonParser);

server.post('/musicians', (req, res, next) => {
    const musician = new Musician(req.body);
    musician
        .save()
        .then(musician => {
            res.send(musician);
        })
        .catch(next);
});

server.get('/musicians/:id', (req, res, next) => {
    Musician.findById(req.params.id)
        .lean()
        .then(musician => {
            res.send(musician);
        })
        .catch(next);
});

server.use(errorHandler);

module.exports = server;