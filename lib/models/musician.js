const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: requiredString,
    eventRate: requiredString,
    genre: { type: String },
    instruments: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model('Musician', schema);