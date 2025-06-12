const redis = require("redis");

const client = redis.createClient();

client.on("error", (err) => {
  console.error("❌ Redis Client Error:", err.message);
});

// Wrap connection in an async IIFE, and catch any error
(async () => {
  try {
    await client.connect();
    console.log("✅ Redis client connected");
  } catch (err) {
    console.error("⚠️ Redis connection failed:", err.message);
    // You can either exit or continue without Redis
  }
})();

module.exports = client;
