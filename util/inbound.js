const allowedBounds = [
  [33.656487295651, -117.85412222020983], //TOP LEFT
  [33.65580858123096, -117.82236486775658], //TOP RIGHT
  [33.63290776411016, -117.85403639000239], // BOTTOM LEFT
  [33.630120665484185, -117.82240778293699], //BOTTOM RIGHT:
];

function isPositionWithinBounds(lat, lng) {
  // Check if the latitude is within bounds
  if (lat < allowedBounds[3][0] || lat > allowedBounds[0][0]) {
    return false;
  }
  // if lng is within bounds
  return lng >= allowedBounds[0][1] && lng <= allowedBounds[1][1];
}
module.exports = isPositionWithinBounds;
