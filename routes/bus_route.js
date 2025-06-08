const express=require("express")
const busRoute=express.Router()
const Busmodel=require("../models/busModel")
const redis=require("../redisClient")
const tokenChecker=require("../middleware/tokenChecker")
const getBuses=async(req,res)=>{
    try {
        
        const {from,to}=req.body
        const cacheKey=`buses from ${from} to ${to}`
        const findBus=await redis.get(cacheKey)
        if(findBus) return res.status(200).json({message:`buses from ${from} to ${to} (from cache)`,retrieve:JSON.parse(findBus)})

        const retrieveBuses=await Busmodel.find({from,to,SeatCount:{$gt:0}})
      await  redis.setEx(cacheKey,3600,JSON.stringify(retrieveBuses))
        return res.status(200).json({message:`retrieved buses from ${from} to ${to} (from DB)`,retrieveBuses})
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
const retrieveBusDetails=async(req,res)=>{
    const{id}=req.params
    if(!id) return res.status(400).json({message:"Please provide id"})
    try {
        
        const cacheKey=`busid:${id}`
        const getBus=await redis.get(cacheKey)
        if(getBus) return res.status(200).json({message:"Retrived bus from cache(redis)",busDetails:JSON.parse(getBus)})
            const findBus=await Busmodel.findById(id)
        if(!findBus) return res.status(404).json({message:"bus does not exists"})
        await redis.setEx(cacheKey,3600,json.stringify(findBus))
        return res.status(200).json({message:"requested Bus data (from db)",findBus})
        
    } catch (error) {
    console.log(error)
    return res.status(500).json({message:"error occured while fetching bus details"})    
    }
}

busRoute.post("/addBus",addBus)
busRoute.post("/getBuses/:id",tokenChecker,retrieveBusDetails)
busRoute.post("/getBuses",tokenChecker,getBuses)
module.exports=busRoute