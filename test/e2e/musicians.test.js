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
        eventRate: '$950 plus babysitting costs',
        genre: 'Industrial',
        instruments: [ 'guitar', 'bass', 'drums', 'bagpipes']
    };

    const dave = {
        name: 'david spencer',
        eventRate: '$5 and a slice',
        genre: 'bluegrass',
        instruments: [ 'harmonica', 'fiddle' ]
    };

    const wanda = {
        name: 'Wanda Roun',
        eventRate: '$875, one meal there, two to take home',
        genre: 'classical',
        instruments: ['xylophone', 'electric toothbrush']
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

    it('returns a list of all musicians', () => {
        return Promise.all([
            saveMusician(dave),
            saveMusician(wanda)
        ])
            .then(() => request.get('/musicians'))
            .then( res => {
                const musicians = res.body;
                assert.equal(musicians.length, 3);
                assert.deepInclude(musicians, aaron);
                assert.deepInclude(musicians, dave);
                assert.deepInclude(musicians, wanda);
            });
    });

    it('updates an existing musician', () => {
        return request.put(`/musicians/${aaron._id}`)
            .send({ eventRate: '$20 if he can bring his kid'})
            .then( res => {
                assert.deepEqual( res.body, { modified: true });
            });
    });

    it('deletes an existing musician', () => {
        return request.del(`/musicians/${dave._id}`)
            .then(res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, { removed: true });
            });
    });

    it('returns removed: false if bad id given for delete', () => {
        return request.del(`/musicians/${dave._id}`)
            .then(res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, { removed: false });
            });
    });

});