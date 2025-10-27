const { createClient } = require("redis");

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("connect", () => console.log("✅ Connected to Redis"));
client.on("error", (err) => console.error("❌ Redis Error:", err));

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
})();

module.exports = client;
