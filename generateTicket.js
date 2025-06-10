const express=require("express")
const router=express.Router()
const ticket=require("./models/ticketModel")
const redis=require("./redisClient")

const generateTicketDetails=async(req,res)=>{
    const {status,BusOperator,BusType,BusNumber,BookedSeat,from,to,via,departure,arrival,Name,age,contact,gender,email}=req.body
    if(!Name||!age||!contact||!gender||!email) return res.status(400).json({message:"Please provide complete information"})
    try {
        const newTicket=new ticket({
    status:"PENDING",
    BusOperator,
   BusType,
   BusNumber,
    BookedSeat,
    from,
    to,
    via,
    departure,
    arrival,
    Name, 
    age,
    gender,
    email,
    contact
    })
    await newTicket.save()
    const cacheKey=`User ticket registered with email:${newTicket.email}`
    await redis.setEx(cacheKey,60,JSON.stringify(newTicket))
    return res.status(200).json({message:"ticket generated succesfully"})
        
    
} catch (error) {
    console.log(error)
    return res.status(500).json({message:"error ocuured while generating ticket"})
} 
}
router.post("/generateTicket",generateTicketDetails)
module.exports=router