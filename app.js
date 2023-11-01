const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const Recommendation = require('./models/recommendation');
const Food = require('./models/food');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override'); 


mongoose.connect('mongodb://127.0.0.1:27017/foodAroundTheWorld')

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log('Database connected');
})

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

let logged_in = null;

app.get('/', (req, res) => {
    res.render('home');
})


app.get('/myArea' , (req,res) => {
    if(logged_in){
        res.render(`users/show`, { user:logged_in , logout:true});
    }
    else{
        res.render('users/login')
    }
})


app.get('/users/:id/show', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render(`users/show`, { user , logout:false});
})

app.get('/users', async (req, res) => {
    const users = await User.find({});
    res.render('users/index', { users })
})


app.get('/users/:page', (req, res) => {
    const { page } = req.params;
    res.render(`users/${page}`)
})


app.get('/users/:id/edit', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('users/edit', { user })
})

app.get('/foods/new' , (req,res) => {
    res.render('foods/new')
})

app.get('/foods' , async (req,res) => {
    const {foodType} =  req.query;
    const foodTypes={
        italian: 'איטלקי',
        mexican: 'מקסיקני',
        indian: 'הודי',
        Moroccan: 'מרוקאי',
        Asian: 'אסיאתי'
    }

    if(foodType){
        const foods = await Food.find({foodType:foodTypes[foodType]});
        res.render('foods/index', { foods,catagory: foodTypes[foodType]})
    }
    else{
        const foods = await Food.find({});
    res.render('foods/index', { foods ,catagory: null})
    }
})


app.get('/foods/:id/edit', async (req, res) => {
    const { id } = req.params;
    const food = await Food.findById(id);
    res.render('foods/edit', { food })
})


app.get('/foods/:foodType', (req, res) => {
    const { foodType } = req.params;
    res.render('foodType', { foodType })
})

app.get('/foods/:id/show', async(req, res) => {
    const { id } = req.params;
    const food = await Food.findById(id);
    res.render('foods/show', { food })
})




app.get('/recommendations/:id/new' ,async (req,res) => {
    const {id} = req.params;
    const user =await User.findById(id);
    console.log('##########################');
    console.log(user);
    console.log('##########################');
    const foods = await Food.find({});
    res.render('recommendations/new' , {foods , user})
})

app.get('/recommendations' ,async (req,res) => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!11');
    const recs = await Recommendation.find().populate('user food').exec(); 
    console.log('logged in'+logged_in);
    res.render('recommendations/index' , {recs ,logged_in}) 
})

app.get('/:page', (req, res) => {
    const { page } = req.params;
    res.render(`${page}`) 
})

app.post('/register', async (req, res) => {
    const newUser = new User(req.body.user);
    await newUser.save();
    console.log(newUser);
    res.redirect(`users/${newUser._id}/show`)
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body.user;
    const user = await User.findOne({ email: req.body.user.email });

    if (user.password === password) {
        logged_in=user;
        res.render(`users/show` , {user:logged_in , logout:true} )
    }
    else {
        res.status(400).send('סיסמה לא נכונה'); // Render an error message in the response using a template
    }
})


app.post('/logout', async (req, res) => {
    logged_in=null;
    res.redirect(`users/login`)
})

app.post('/newFood', async (req, res) => {
    const {name , foodType , recipe , image} = req.body.food;
    const food = new Food({name,foodType,recipe,image});
    await food.save();
    res.redirect('/foods')
})

app.post('/newRecommendation', async (req, res) => {
    const { userId, foodId, description } = req.body.recommendation;
    const rec = new Recommendation({
        user: userId,
        food: foodId,
        description: description
    });
    await rec.save();
    await rec.populate('user'); // Wait for the population to complete
    // console.log(rec.user); // You can access the populated user data here
    // console.log('!!!!!!');
    // console.log(rec);
    res.redirect('/recommendations');
})

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body.user, { runValidators: true, new: true });
    res.redirect(`show/${updatedUser._id}`)
})

app.put('/foods/:id', async (req, res) => {
    const { id } = req.params;
    const updatedFood = await Food.findByIdAndUpdate(id, req.body.food, { runValidators: true, new: true });
    res.redirect(`${updatedFood._id}/show`)
})



app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndDelete(id);
    res.redirect('/users')
})

app.delete('/foods/:id', async (req, res) => {
    const { id } = req.params;
    const updatedFood = await Food.findByIdAndDelete(id);
    res.redirect('/foods/all')
})

app.delete('/deleteRecommendation/:id' ,async (req,res) => {
    const {id} = req.params;
    const rec= await Recommendation.findByIdAndDelete(id);
    res.redirect('/recommendations')
})

app.listen(3000, async () => {
    console.log('Yeaaaa');
})


function findKeyByValue(object, valueToFind) {
    for (const key in object) {
        if (object[key] === valueToFind) {
            return key;
        }
    }
    return null; // Return null if the value is not found
}