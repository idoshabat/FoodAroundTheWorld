const mongoose = require('mongoose');
const User = require('./user');
const Food = require('./food');

const Schema = mongoose.Schema;

const RecommendationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    },

    description: String,
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
