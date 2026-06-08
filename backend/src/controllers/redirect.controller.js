import * as redirectService from "../services/redirect.service.js";

export const redirectToOriginalUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const originalUrl = await redirectService.getOriginalUrl(shortCode);
    return res.redirect(originalUrl);
  } catch (error) {
    next(error);
  }
};
