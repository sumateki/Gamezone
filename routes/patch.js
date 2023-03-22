const express= require('express')
const router= express.Router()
const User= require('../models/UserDetails')

//patch request for updtig data
router.patch('/:id', async(req,res)=>
{
    try{
        const routes= await User.findById(req.params.id)
        //update the item whichever you want
        routes.playerName= req.body.playerName
        routes.email= req.body.email
        routes.password= req.body.password
        routes.confirmPassword= req.body.confirmPassword
        
        const r1= await routes.save()
        res.json(r1)
    }
    catch(err)
    {
        res.send('Error'+err)
    }
})


module.exports= router