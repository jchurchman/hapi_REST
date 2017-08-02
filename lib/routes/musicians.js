// const restify = require('restify');
// const server  = restify.createServer();
// const Musician = require('../models/musician');
// const jsonParser = require('body-parser').json();

// server

//     .use(jsonParser)

//     .post('/', (req, res, next) => {
//         const musician = new Musician(req.body);
//         musician
//             .save()
//             .then( musician => {
//                 res.send(musician);
//             })
//             .catch(next);
//     })

// module.exports = server;