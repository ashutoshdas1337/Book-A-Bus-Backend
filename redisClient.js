const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.error("❌ Redis Client Error", err));

(async () => {
  try {
    await client.connect();
    console.log("✅ Redis client connected");
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
  }
})();

module.exports = client;
