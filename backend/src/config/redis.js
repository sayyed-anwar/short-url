import { createClient } from "redis";
import { env } from "./env.js";
import logger from "../utils/logger.js";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (error) => {
  logger.error({
    event: "REDIS_ERROR",
    message: error.message,
  });
});

redisClient.on("connect", () => {
  logger.info({
    event: "REDIS_CONNECTED",
  });
});

export const connectRedis = async () => {
  await redisClient.connect();
};

export default redisClient;
