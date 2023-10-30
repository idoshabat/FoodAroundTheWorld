const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    name: String,
    foodType:{
        type : String,
        enum : ['איטלקי','מקסיקני', 'הודי' ,'מרוקאי' , 'אסיאתי' , 'תימני']
    },
    recipe: String,
    // description: String,
    image: String
});

module.exports = mongoose.model('Food', FoodSchema);
