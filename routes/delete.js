const express= require('express')
const router= express.Router()
// const User= require('../models/UserDetails')
const User= require('../models/schema')

//delete the data which is not used or no need
router.delete('/:id', async(req,res)=>
{
    try{
        const route= await User.findById(req.params.id)
        const r1= await route.remove()
        res.json()
    }
    catch(err)
    {
        res.send('Error'+err)
    }
})



module.exports= router