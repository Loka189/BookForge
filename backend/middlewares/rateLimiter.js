const redisClient = require("../config/redisClient");

function rateLimiter({ windowSize = 60, maxRequests = 10 }) {
  return async (req, res, next) => {
    try {
      const userKey = req.user?._id || req.ip;
      const key = `rate:${userKey}`;
      const now = Date.now();

      const timestamps = await redisClient.lRange(key, 0, -1);

      const validTimestamps = timestamps.filter(
        (t) => now - parseInt(t) <= windowSize * 1000
      );

      if (validTimestamps.length !== timestamps.length) {
        await redisClient.del(key);
        if (validTimestamps.length > 0)
          await redisClient.rPush(key, validTimestamps.map(String)); // ✅ ensure strings
      }

      if (validTimestamps.length >= maxRequests) {
        const retryAfter = Math.ceil(
          (windowSize * 1000 - (now - validTimestamps[0])) / 1000
        );
        return res
          .status(429)
          .json({ message: `Too many requests. Try again in ${retryAfter}s.` });
      }

      await redisClient.rPush(key, String(now)); 
      await redisClient.expire(key, windowSize);

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      next(); // fail open (don’t block)
    }
  };
}

module.exports = rateLimiter;
