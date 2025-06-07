// import mongoose so that we can use its functionalities
const mongoose=require("mongoose")

// one such functionality is schema which is like a blueprint that an entity should have , think it like that of a class in java

const BusSchema=new mongoose.Schema({
    BusOperator:{type:String,required:true},

    BusType:{type:String,required:true},
    
    ServiceType:{type:String,required:true},
    
    SeatCount:{type:Number,required:true},

    // WindowSeats:{type:Number,required:true},

    // MiddleSeats:{type:Number,required:true},

    // AisleSeats:{type:Number,required:true},

    // SleeperCabins:{type:Number,required:true},

    from:{type:String,required:true},
    
    to:{type:String,required:true},
    
    via:{type:String,required:true},
    
    BusFare:{type:Number,required:true},

    departure:{type:String,required:true},

    arrival:{type:String,required:true}
})

// model is say an approved schema which should be followed while making a new object, here we export it so we can use it to save new buses
module.exports=mongoose.model("BusModel",BusSchema)