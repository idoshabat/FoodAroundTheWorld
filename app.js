const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const ejsMate = require('ejs-mate');


mongoose.connect('mongodb://127.0.0.1:27017/foodAroundTheWorld')

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once("open" , ()=>{
    console.log('Database connected');
})

const app = express();

app.set('views' , path.join(__dirname, 'views'));
app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.engine('ejs',ejsMate);

let logged_in=false;

app.get('/' , (req,res) =>{
    res.render('home');
})

// app.get('/myArea' , (req,res) => {
//     if(logged_in){

//     }
//     else{

//     }
// })

app.get('/:page' , (req,res) => {
    const {page} = req.params;
    res.render(`${page}`)
})

app.get('/food/:foodType' , (req,res) => {
    const {foodType} = req.params;
    res.render('foodType' , {foodType})
})

app.listen(3000, async ()=>{
    console.log('Yeaaaa');
})