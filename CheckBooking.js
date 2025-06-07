const express=require("express")
const availabilityRouter=express.Router()
const nodemailer=require("nodemailer")

const checkAvailablity=async (req,res)=>{
    const {seatNo,busType,busOperator,from,to,departure,arrival,email}=req.body
    
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"ashutoshdas1001@gmail.com",
            pass:"ldaxerlumujazoor"
        }
    })
    
    const mailContent={
        from:"ashutoshdas1001@gmail.com",
        to:"ashutoshdas1001@gmail.com"
        subject:"URGENT! check seat availaibility",
        html:`<h1 style="color:red;">Hello, kindly check the availiability of seat no ${seatNo} of the bus type ${busType} whose operrator is ${busOperator} which will depart from ${from} at ${departure} and arrive ${to} at ${arrival}</h1> `
    }
    
    transporter.sendEmail(mailContent,(error,info)=>{
        if(error) console.log(error)
            if(info) console.log(info)
    })

    return res.status(200).json({message:"Your request for seat availiabilty has been sent. You will receive an email regarding the seat shortly"})
} 
const sendResponse=async(req,res)=>{
    const {email,availiability}=req.body

    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"ashutoshdas1001@gmail.com",
            pass:"ldaxerlumujazoor"
        }
})
    if(availiability){

        const mailContent={
            from:"ashutoshdas1001@gmail.com",
            to:email,
            subject:"Email regarding confirmation of seat",
            
            html:`<h1>The seat you requested to check for is currently Availaible.Complete your payment so that the admin can confirm and book your ticket.<h1> `
        }
    }
    else{
         const mailContent={
            from:"ashutoshdas1001@gmail.com",
            to:email,
            subject:"Email regarding confirmation of seat",
            
            html:`<h1>The seat you requested to check for is currently Unavailaible.Try requesting for a different seat <h1> `
        }
    }
    transporter.sendMail(mailContent,(error,info)=>
    {
        if(error)console.log(error)
        if(info) console.log(info)
    })
}

availabilityRouter.sendResponse("/sendResponse")
availabilityRouter.post("/checkAvailiability",checkAvailablity)
