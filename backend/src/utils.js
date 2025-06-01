//                Hour * Min * Sec
const CACHE_TTL = 1 * 5 * 60;   // set to 5 minutes

const metersToFeet = (meters) => meters * 3.28084;

const degreesToDirection = (degree) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]; 
    degrees = degree % 360
    index = Math.round(degree / 22.5) % 16
    return directions[index];
}

module.exports = { CACHE_TTL, metersToFeet, degreesToDirection }