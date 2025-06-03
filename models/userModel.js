const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    username:{type:String,required:true},

    email:{type:String,required:true,unique:true},

    password:{type:String,required:true},

    contact:{type:Number,required:true,unique:true},
})
module.exports=mongoose.model("UserModel",UserSchema)