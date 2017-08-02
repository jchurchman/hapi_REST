const chai = require('chai');
const { assert } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/musicians-test';

const connect = require('../../lib/connect');

let connection = require('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe('musicians REST api', () => {

    before(() => {
        return connect(process.env.MONGODB_URI)
            .then(cn => connection = cn);
    });

    before(() => connection.dropDatabase());

    after(() => connection.close());

    const aaron = {
        name: 'Aaron Illin',
        eventRate: '$950',
        genre: 'Industrial',
        instruments: [ 'guitar', 'bass', 'drums', 'bagpipes']
    };

    function saveMusician(musician) {
        return request.post('/musicians')
            .send(musician)
            .then( ({ body }) => {
                musician._id = body._id;
                musician.__v = body.__v;
                return body;
            });
    }

    it('saves a musician', () => {
        return saveMusician(aaron)
            .then(savedMusician =>{
                assert.isOk(savedMusician._id);
                assert.deepEqual(savedMusician, aaron);
            });
    });

});