const express=require("express")
const router=express.Router()
const ticket=require("./models/ticketModel")


const generateTicketDetails=async(req,res)=>{
    const {status,busOperator,busType,seatNo,from,to,via,departure,arrival,name,age,contact,gender}=req.body
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
        contact
    })
} 

router.post("/generateTicket",generateTicket)