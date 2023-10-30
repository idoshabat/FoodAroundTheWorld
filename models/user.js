const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    image: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/1053/1053244.png' // Provide your default image file name
    }
})

module.exports = mongoose.model('User' ,UserSchema);