//                Hour * Min * Sec
const CACHE_TTL = 1 * 5 * 60;   // set to 5 minutes

module.exports = function cacheControl (maxAge=CACHE_TTL){
    return function (req, res, next) {
        res.set('Cache-Control', `public, max-age= ${maxAge}`); // Set Browser HTTP Cache
        next();
    }
}
