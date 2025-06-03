const mongoose=require("mongoose")

const busRouteSchema=new mongoose.model({
    from:{type:String,required:true},

    to:{type:String,required:true},
    
    via:{type:String,required:true},
    
    distance:{type:Number,required:true}
})
module.exports=mongoose.model("busRouteModel",busRouteSchema)