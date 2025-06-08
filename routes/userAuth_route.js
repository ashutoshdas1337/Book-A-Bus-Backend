const express=require("express")
const router=express.Router()
const User=require("../models/userModel")
const jwt =require("jsonwebtoken")
const bcrypt=require("bcrypt")
require("dotenv").config()

const secret=process.env.JWT_SECRET

const createUser=async(req,res)=>{
    const {username,email,password,contact}=req.body
    try {
        if(!username||!email||!password||!contact) return res.status(400).json({message:"Please provide full info"})
        const checkEmail=await User.findOne({email})
    const checkPhone=await User.findOne({contact})
    if(checkEmail||checkPhone) return res.status(409).json({message:"email or password already registered"})
    const hash_password=await bcrypt.hash(password,10)
        const newUser=new User({username,email,password:hash_password,contact})
        await newUser.save()
        const token=jwt.sign({username:username,email:email,contact:contact},secret,{expiresIn:"1h"})
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            maxage:3600000
        })
        return res.status(200).json({message:"User created succesfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"error occured while creating user"})
    }
}
const authorizeUser=async(req,res)=>{
    const {email,password}=req.body
    try {
        if(!email||!password)return res.status(400).json({message:"email or password missing"})
        const checkEmail=await User.findOne({email})
    if(!checkEmail) return res.status(404).json({message:"User does not exist, consider creating one"})
    const isPasswordRight=await bcrypt.compare(password,checkEmail.password)
        if(!isPasswordRight) return res.status(401).json({message:"Wrong password"})
        const token=jwt.sign({username:checkEmail.username,email:checkEmail.email,contact:checkEmail.contact},secret,{expiresIn:"1h"})
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,maxage:3600000
    })
    return res.status(200).json({message:"User logged in succesfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"error occured while logging user "})
    }
}
const logoutUser=async(req,res)=>{
    res.clearCookie("token")
    return res.status(200).json({message:"User logged out succesfully"})
}

router.post("/createUser",createUser)
router.post("/login",authorizeUser)
router.post("/logout",logoutUser)
module.exports=router