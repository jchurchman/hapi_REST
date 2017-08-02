const Musician = require('../../lib/models/musician');

const { assert } = require('chai');

describe('Musician model', () => {

    it('validates with required fields', () => {
        const billy = new Musician({
            name: 'Billy Thornton',
            eventRate: '$425, dinner, drinks',
            genres: 'blues', 
            instruments: ['kazoo', 'concertina', 'saw']
        });

        return billy.validate();
    });

    it('fails validation when required fields are missing', () => {
        const steve = new Musician();

        return steve.validate()
            .then(
                () => { throw new Error('Expected Validation Error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                    assert.ok(errors.eventRate);
                }
            );
    });

});