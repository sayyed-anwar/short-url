import pino from "pino";
import { env } from "../config/env.js";

const logger = pino({
  transport:
    env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});

export default logger;
