const redis = require("redis");

const client = redis.createClient();

client.on("error", (err) => console.error("❌ Redis Client Error", err));

(async () => {
  await client.connect(); // ⚠️ Important!
  console.log("✅ Redis client connected");
})();
module.exports=client