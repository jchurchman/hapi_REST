const restify = require('restify');
const server = restify.createServer();
const errorHandler = require('./error-handler')();
const Musician = require('./models/musician');
const jsonParser = require('body-parser').json();
const musicians = require('./routes/musicians');

server.get('/musicians/:id', (req, res, next) => {
    Musician.findById(req.params.id)
        .lean()
        .then(musician => {
            res.send(musician);
        })
        .catch(next);
});

server.get('/musicians', (req, res, next) => {
    Musician.find()
        .lean()
        .then(musicians => res.send(musicians))
        .catch(next);
});

server.del('/musicians/:id', (req, res, next) => {
    Musician.remove()
        .where({ _id: req.params.id })
        .then(response => {
            res.send({ removed: response.result.n === 1 });
        });
});

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

server.put('/musicians/:id', (req, res, next) => {
    Musician.update(
        { _id: req.params.id },
        { $set: req.body },
        {
            new: true,
            multi: false,
            runValidators: true
        })
        .lean()
        .then( response =>  res.send( { modified: response.nModified === 1 } ))
        .catch(next);
});


server.use(errorHandler);

module.exports = server;