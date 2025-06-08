const express=require("express")
const router=express.Router()
const ticket=require("./models/ticketModel")


const generateTicketDetails=async(req,res)=>{
    const {status,busOperator,busType,seatNo,from,to,via,departure,arrival,name,age,contact,gender,email}=req.body
    if(!name||!age||!contact||!gender||!email) return res.status(400).json({message:"Please provide complete information"})
    const newTicket=new ticket({
        status:"Pending",
        busOperator,
        busType,
        seatNo,
        from,
        to,
        via,
        departure,
        arrival,
        name,
        age,
        gender,
        email,
        contact
    })
} 

router.post("/generateTicket",generateTicket)