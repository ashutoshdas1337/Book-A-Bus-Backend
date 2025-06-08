const express=require("express")
const app=express()
const mongoose=require("mongoose")
const busRouter=require("./routes/bus_route")
const redisClient=require("./redisClient")
const cookie_parser=require("cookie-parser")
const userAuth=require("./routes/userAuth_route")
app.use(express.json())
app.use(cookie_parser())

const MongoDBUrl="mongodb://localhost:27017/Book-a-Bus-DB"
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


app.use("/user",userAuth)

app.use("/buses",busRouter)
const port=8080
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});