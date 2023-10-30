const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
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




app.get('/users/show/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render(`users/show`, { user , logout:false});
})

app.get('/users', async (req, res) => {
    const users = await User.find({});
    res.render('users/index', { users })
})

app.get('/:page', (req, res) => {
    const { page } = req.params;
    res.render(`${page}`)
})

app.get('/users/:page', (req, res) => {
    const { page } = req.params;
    res.render(`users/${page}`)
})

app.get('/food/:foodType', (req, res) => {
    const { foodType } = req.params;
    res.render('foodType', { foodType })
})

app.get('/users/:id/edit', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('users/edit', { user })
})

app.post('/register', async (req, res) => {
    const newUser = new User(req.body.user);
    await newUser.save();
    console.log(newUser);
    res.redirect(`users/show/${newUser._id}`)
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body.user;
    console.log(email, password);
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
    res.redirect(`home`)
})

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body.user, { runValidators: true, new: true });
    res.redirect(`show/${updatedUser._id}`)
})

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndDelete(id);
    res.redirect('/users')
})

app.listen(3000, async () => {
    console.log('Yeaaaa');
})