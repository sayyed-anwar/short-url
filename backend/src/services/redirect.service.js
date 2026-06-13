import * as urlRepository from "../repositories/url.repository.js";
import * as analyticsService from "./analytics.service.js";

import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

import { getCache, setCache, deleteCache } from "../cache/redisCache.js";

export const getOriginalUrl = async (shortCode, clickContext) => {
  const cacheKey = `url:${shortCode}`;

  const cachedUrl = await getCache(cacheKey);

  if (cachedUrl) {
    logger.info({
      event: "CACHE_HIT",
      shortCode,
    });

    const data = JSON.parse(cachedUrl);

    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      await deleteCache(cacheKey);

      logger.warn({
        event: "EXPIRED_URL_ACCESS",
        shortCode,
        source: "cache",
      });

      throw new AppError("URL has expired", 410);
    }

    await urlRepository.incrementClickCount(data.id);

    await analyticsService.trackClick(data.id, clickContext);

    return data.originalUrl;
  }

  logger.info({
    event: "CACHE_MISS",
    shortCode,
  });

  const url = await urlRepository.findByShortCode(shortCode);

  if (!url) {
    logger.warn({
      event: "SHORT_URL_NOT_FOUND",
      shortCode,
    });

    throw new AppError("Short URL not found", 404);
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    await deleteCache(cacheKey);

    logger.warn({
      event: "EXPIRED_URL_ACCESS",
      shortCode,
      source: "database",
    });

    throw new AppError("URL has expired", 410);
  }

  await urlRepository.incrementClickCount(url._id);

  await analyticsService.trackClick(url._id, clickContext);

  await setCache(cacheKey, {
    id: url._id.toString(),
    originalUrl: url.originalUrl,
    expiresAt: url.expiresAt,
  });

  return url.originalUrl;
};
