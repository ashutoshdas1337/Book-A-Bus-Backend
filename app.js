const express=require("express")
const app=express()
const mongoose=require("mongoose")
const busRouter=require("./routes/bus_route")
const redisClient=require("./redisClient")
const cookie_parser=require("cookie-parser")
const userAuth=require("./routes/userAuth_route")
const ticketGenerator=require("./generateTicket")
const cashfree=require("./cashFree")
const seeTicket=require("./showUserTicket")


require("dotenv").config()
app.use(express.json())
app.use(cookie_parser())

const MongoDBUrl=process.env.MONGODB_URL
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MongoDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    
  }
};
app.use("/userTickets",seeTicket)
app.use("/ticketGenerator",ticketGenerator)
app.use("/user",userAuth)
app.use("/payments",cashfree)
app.use("/buses",busRouter)
const port=8080
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});