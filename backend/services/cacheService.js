const { redisClient, redisStatus } = require("../config/redisClient");

exports.getCache = async (key) => {
  // Skip if Redis is down
  if (!redisStatus.isHealthy) {
    console.warn("⚠️ Redis unavailable, cache miss");
    return null;
  }

  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn("⚠️ Redis GET failed:", err.message);
    redisStatus.isHealthy = false;
    return null; // Fallback: act like cache miss
  }
};

exports.setCache = async (key, value, ttl = 3600) => {
  // Skip if Redis is down
  if (!redisStatus.isHealthy) {
    console.warn("⚠️ Redis unavailable, skipping cache set");
    return;
  }

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.warn("⚠️ Redis SET failed:", err.message);
    redisStatus.isHealthy = false;
  }
};

exports.delCache = async (key) => {
  // Skip if Redis is down
  if (!redisStatus.isHealthy) {
    console.warn("⚠️ Redis unavailable, skipping cache delete");
    return;
  }

  try {
    await redisClient.del(key);
  } catch (err) {
    console.warn("⚠️ Redis DEL failed:", err.message);
    redisStatus.isHealthy = false;
  }
};