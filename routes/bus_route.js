const express=require("express")
const busRoute=express.Router()
const Busmodel=require("../models/busModel")

const getBuses=async(req,res)=>{
    try {
        
        const {from,to}=req.body
        const retrieveBuses=await Busmodel.find({from,to,SeatCount:{$gt:0}})
        return res.status(200).json({message:`retrieved buses from ${from} to ${to}`,retrieveBuses})
    } 
    catch (error) {
    console.log(error)
    return res.status(500).json({message:"error occured while getting buses"})    
    }
}
const addBus=async(req,res)=>{
    try {
        
        const {BusOperator,BusType,ServiceType,SeatCount,from,to,via,BusFare,departure,arrival}=req.body
        if(!BusOperator||!BusType||!ServiceType||!SeatCount||!from||!to||!via||!BusFare||!departure||!arrival) return res.status(400).json({message:"Please provide complete information"})
        const createBus=new Busmodel({BusOperator,BusType,ServiceType,SeatCount,from,to,via,BusFare,departure,arrival})
    await createBus.save()
    return res.status(200).json({message:"Bus added succesfully"})
} catch (error) {
 console.log(error)
 return res.status(500).json({message:"error ocuured while adding bua"})   
}
}

busRoute.post("/addBus",addBus)
busRoute.post("/getBuses",getBuses)
module.exports=busRoute