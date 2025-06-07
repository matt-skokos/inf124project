const metersToFeet = (meters) => meters * 3.28084;

const degreesToDirection = (degree) => {
    const directions = [
        "N", "NNE", "NE", "ENE",
        "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW",
        "W", "WNW", "NW", "NNW"
    ];

    degrees = degree % 360
    index = Math.round(degree / 22.5) % 16
    return directions[index];
}

const normalize = (str) => str.trim().toLowerCase();

module.exports = { metersToFeet, degreesToDirection, normalize }