//                Hour * Min * Sec
const CACHE_TTL = 1 * 5 * 60; // set to 5 minutes

/**
 * Middleware to set Cache-Control headers
 * @param {number} maxAge Max age in seconds
 */
module.exports = function cacheControl(maxAge = 60) {
  return (req, res, next) => {
    // Set Cache-Control header
    res.setHeader("Cache-Control", `public, max-age=${maxAge}`);
    next();
  };
};
