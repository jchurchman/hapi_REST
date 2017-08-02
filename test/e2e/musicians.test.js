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

    it('gets a musician by id', () => {
        return request
            .get(`/musicians/${aaron._id}`)
            .then( res => res.body )
            .then( gotMusician => {
                assert.deepEqual(gotMusician, aaron);
            });
    });

    it('returns error if faulty id is passed for get request', () => {
        return request
            .get('/musicians/642978425861ha834619863j')
            .then(
                () => { throw new Error('successful status code not expected');},
                ({ response }) => {
                    assert.equal(response.status, 500);
                    assert.isOk(response.error);
                }
            );
    });

});