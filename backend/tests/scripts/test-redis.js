import redisClient from "../../src/config/redis.js";
import { connectRedis } from "../../src/config/redis.js";

await connectRedis();

await redisClient.set("test", "hello");

const value = await redisClient.get("test");

console.log(value);

process.exit(0);
