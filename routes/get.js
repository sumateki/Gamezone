const express= require('express')
const router= express.Router()
const jwt= require('jsonwebtoken')
const User= require('../models/schema')

//create jwt secret --- hardcoding jwt secret here insted of creating .env file
const JWT_SECRET = 'some super secret..'



//get request for getting all the data stored in db
router.get('/abc',async(req,res)=>
{
    try{
        const routes= await User.find()
        res.json(routes)
    }
    catch(err)
    {
        res.send('Error', +err)
    }
})

//setup route to login page
router.get('/login', (req, res) => {
    res.render('login'); //call login page
  });

router.get('/dashboard', (req, res) => {
    if (req.session.user) {
      res.render('dashboard', { email: req.session.user.email });
    } else {
      res.redirect('/');
    }
  });


  //forgot password form
router.get('/forgot-password', (req,res, next)=>
{
  res.render('forgot-password')
})

//reset password
router.get('/reset-password/:id/:token',(req, res, next)=>
{
  const {id, token}= req.params
  let User= {
    id: req.params.id,
    email: req.body.email,
    password: req.body.password
  }
  
  //check if this id exists in db
  if(id !== User.id)
  {
    res.send('Invalid id..')
    return
  }

  //we have a valid id and we have a valid user with this id
  const secret= JWT_SECRET + User.password
  try{
    const payload= jwt.verify(token, secret)
    res.render('reset-password', {email: User.email})

  }
  catch(err)
  {
    console.log(err.message)
    res.send(err.message)
  }

})
module.exports= router