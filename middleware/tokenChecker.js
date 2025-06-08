const express=require("express")
const secret="cowsdomoo"
const jwt=require("jsonwebtoken")
const tokenChecker=async(req,res,next)=>{
    const token=req.cookies.token
    if(!token) return res.status(404).json({message:"token not found"})
    try {
        const user=jwt.verify(token,secret)
        req.user=user
        next()
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"error occured while validating token"})
    }
}
module.exports=tokenChecker