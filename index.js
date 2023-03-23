const express= require('express')
const mongoose= require('mongoose')
const bodyParser= require('body-parser')
const session = require('express-session');
// const bcrypt= require('bcryptjs')
const path= require('path')
require('dotenv').config()

//to start express
const app= express()

//database connection
const url= 'mongodb://localhost/Gamezone'
mongoose.connect(url, ()=>
{
    console.log('Database Conencted..!!')
})

//setup path for hbs files
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))

//setup middleware for parsing JSON and handling form data
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//to get styles
app.use(express.static(__dirname + '/public'))


//login page
const getLogin= require('./routes/get')
app.use('/', getLogin)

const postLogin= require('./routes/post')
app.use('/', postLogin)


//forgot-password
const frgt_pwd= require('./routes/get')
app.use('/', frgt_pwd)

const post_frgt_pwd= require('./routes/post')
app.use('/',post_frgt_pwd)


//get routes for reading data from database
const getRouter= require('./routes/get')
app.use('/get', getRouter)

//post routes for creating data into database
const postRouter= require('./routes/post')
app.use('/post', postRouter)

//patch routes for updating data 
const patchRouter= require('./routes/patch')
app.use('/patch', patchRouter)

//delete routes from database
const deleteRouter= require('./routes/delete')
app.use('/delete', deleteRouter)


//server
const port=8000
app.listen(port, ()=>
{

    console.log(`Server is running.. go to localhost ${port}`)
})

