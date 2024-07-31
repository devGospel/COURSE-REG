const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs');
const bodyparser = require('body-parser')
const app = new express()
const MongoStore = require('connect-mongo') 
const session = require('express-session') 
// const expressLayout = require('express-ejs-layouts')

const connectDB = require('./config/db')
connectDB();



const store = MongoStore.create({
  mongoUrl: 'mongodb://127.0.0.1:27017/COURSE_REG_DB',
  collection: "mySessions",
});


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store, 
    cookie: {maxAge: 60 * 60 * 1000}
})); 


app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(expressLayout)
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

 



app.use('/', require('./server/routes/user')) 
app.use('/', require('./server/routes/course')) 
app.use('/', require('./server/routes/profile')) 
 

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
}); 
  
 
 


     












 