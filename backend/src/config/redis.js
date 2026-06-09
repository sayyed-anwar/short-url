import { createClient } from "redis";
import { env } from "./env.js";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.log("Redis Error", error.message);
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

export const connectRedis = async () => {
  await redisClient.connect();
};

export default redisClient;
