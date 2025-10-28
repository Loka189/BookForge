const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const redisStatus = {
  isHealthy: false
};

redisClient.on("error", (err) => {
  redisStatus.isHealthy = false;
  console.warn("🚨 Redis connection error:", err.message);
});

redisClient.on("connect", () => {
  redisStatus.isHealthy = true;
  console.log("✅ Connected to Redis");
});

redisClient.on("end", () => {
  redisStatus.isHealthy = false;
  console.warn("❌ Redis connection closed");
});
redisClient.on("reconnecting", () => {
  console.log("🔄 Reconnecting to Redis...");
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    redisStatus.isHealthy = false;
    console.error("❌ Failed to connect to Redis:", err.message);
  }
})();

module.exports = { redisClient, redisStatus };
