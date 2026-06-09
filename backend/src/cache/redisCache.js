import redisClient from "../config/redis.js";

export const getCache = async (key) => {
  return redisClient.get(key);
};

export const setCache = async (key, value, ttl = 3600) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttl,
  });
};

export const deleteCache = async (key) => {
  await redisClient.del(key);
};
