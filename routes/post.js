const express= require('express')
const router= express.Router()
const jwt= require('jsonwebtoken')
const User= require('../models/schema')

//create jwt secret --- hardcoding jwt secret here insted of creating .env file
const JWT_SECRET = 'some super secret..'


//post request for creating data
router.post('/abc', async(req,res)=>
{
    console.log(req.body)
    const routes= new User({

        //data coming from req obj
        playername: req.body.playername,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })
    try{
        const r1= await routes.save()
        res.json(r1)
    }
    catch(err)
    {
        res.send('Error' +err)
    }
})


// setup route to handle login submission
router.post('/login', async(req,res)=>
{
    const {email, password} =req.body
    console.log(req.body)
    User.findOne({email:email}).then(user =>
        {
           
            if(!user)
            {
                return res.status(404).json({message: 'User not found'})
            }
           
               console.log(password, user.password) 
                    if(password===user._doc.password)
                    {
                       return res.status(200).json({message: 'Login successfully'})
                    }
                    else{
                        return res.status(401).json({message: 'Invalid credentials'})
                    }
                })
               
         .catch(err =>
            {
                console.log(err)
                return res.status(500).json({message: 'Internal server error'})
            })

        })

//forgot-password
router.post('/forgot-password', (req, res, next)=>
{
    const {email} = req.body
    let User= {
        id: req.params.id,
        email: req.body.email,
        password: req.body.password
    }
    //make sure user exists in db
    if(email !== User.email)
    {
        res.send('User not registered')
        return
    }

    //if user exists then create one time link for some time(10min)
    //generate new scret
    const secret= JWT_SECRET + User.password
    //create payload -- this payload stored inside jwt token
    const payload=
    {
        email: User.email,
        id: req.params.id
    }
    const token= jwt.sign(payload, secret, {expiresIn: '15m'})
    const link= `http://localhost:8000/reset-password/${User.id}/${token}`
    console.log(link)
    res.send('Please open your console to access password reset link..')
})


//reset-passsword
router.post('/reset-password/:id/:token', (req, res, next)=>
{
    const {id, token}= req.params
    let User= {
        id: req.params.id,
        email: req.body.email,
        password: req.body.password
    }
    //extract password 
    const {password}= req.body
    //check if this id exists in db
    if(id !== User.id)
    {
        res.send('Invalid id..')
        return
    }

    const secret= JWT_SECRET + User.password
    try{
        const payload= jwt.verify(token, secret)
        User.password= password
        res.send(User)
        console.log(payload)
    }
    catch(err)
    {
        console.log(err.message)
        res.send(err.message)
    }
})


module.exports= router
