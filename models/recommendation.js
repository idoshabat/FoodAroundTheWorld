const mongoose = require('mongoose');
const User = require('./user'); // Assuming User is the correct model you want to import
const Schema = mongoose.Schema;

const RecommendationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    food: String,
    recipe: String,
    description: String,
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
