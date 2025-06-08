const metersToFeet = (meters) => meters * 3.28084;

const degreesToDirection = (degree) => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  const degrees = degree % 360;
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const normalize = (str) => str.trim().toLowerCase();

module.exports = { metersToFeet, degreesToDirection, normalize };
