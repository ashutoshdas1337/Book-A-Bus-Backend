const express=require("express")
const router=express.Router()
const redis=require("./redisClient")
const ticket=require("./models/ticketModel")
const tokenChecker = require("./middleware/tokenChecker")

const showTicket=async(req,res)=>{
try {
    const getEmail=req.user.email
    const cacheKey=`User ticket registered with email:${getEmail}`
    const getTicket_fromRedis=await redis.get(cacheKey)
    if(getTicket_fromRedis) return res.status(200).json({message:"ticket retrieved (from redis)",retrieve:JSON.parse(getTicket_fromRedis)})
        const getTicket_fromMongo=await ticket.find({email:getEmail,status:{$in:["PENDING","CONFIRMED"]}})
    if(!getTicket_fromMongo) return res.status(404).json({message:"no tickets found"})
await redis.setEx(cacheKey,300,JSON.stringify(getTicket_fromMongo))
    return res.status(200).json({message:"ticket retrieved (from mongo)",retrieved:JSON.parse(getTicket_fromMongo)})
} catch (error) {
console.log(error)
return res.status(500).json({message:"error retrieving ticket"})    
}
}
router.post("/showUserTicket",tokenChecker,showTicket)
module.exports=router
