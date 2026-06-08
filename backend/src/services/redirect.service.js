import * as urlRepository from "../repositories/url.repository.js";

export const getOriginalUrl = async (shortCode) => {
  const url = await urlRepository.findByShortCode(shortCode);

  if (!url) {
    throw new Error("Short URL not found");
  }

  await urlRepository.incrementClickCount(url._id);
  return url.originalUrl;
};
