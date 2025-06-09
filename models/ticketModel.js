const mongoose=require("mongoose")

const ticketModel=new mongoose.Schema({
    status:{type:String,required:true},
    
    BusOperator:{type:String,required:true},

    BusType:{type:String,required:true},

    BusNumber:{type:String,required:true},

    BookedSeat:{type:Number,required:true},

    from:{type:String,required:true},
    
    to:{type:String,required:true},

    via:{type:String,required:true},

    departure:{type:String,required:true},

    arrival:{type:String,required:true},

    Name:{type:String,required:true},

    age:{type:String,required:true},

    gender:{type:String,required:true},

    contact:{type:String,required:true},

    email:{type:String,required:true}


})

module.exports=mongoose.model("Ticket",ticketModel)