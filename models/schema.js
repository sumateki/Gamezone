const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const registerSchema=mongoose.Schema({
  "playername":{
    type:String,
    required:true
  },
  "email":{
    type:String,
    required:true
  },
  "password":{
    type:String,
    required:true
  },
  "confirmPassword":{
    type:String,
    required:true
  },

})



registerSchema.pre("save",async function(next){
  if(this.isModified("password")){
    console.log(`the current password is ${this.password}`);
    this.password=await bcrypt.hash(this.password,10);
    console.log(`the current password is ${this.password}`);

     this.confirmPassword=undefined;
  }
  next();
})

const User= mongoose.model('User',registerSchema);

module.exports=User;