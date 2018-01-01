// stretches a value between 0 and 1 to 0 or 1, symetric relative to 0.5
export function approachExtrema01(value: number): number {
  return (3 - 2 * value) * value * value;
}

export function approachCenter(value: number): number {
  return ((2 * value - 3) * value + 2) * value;
}

// TODO: create a bubble factory, i.e. an obstacle factory
export function badBubble(x: number, y: number, diameter: number): Obstacle {
  var pos = new positionProto(x, y, worldDistanceFactor);
  var radius = diameter / 2;
  var hit = new hitboxProto(pos, radius, radius, radius);
  var obs = new obstacleProto(
    pos,
    diameter,
    diameter,
    spriteList.badBubble,
    hit,
    'bad'
  );
  return obs;
}

export function goodBubble(x: number, y: number, diameter: number): Obstacle {
  var pos = new positionProto(x, y, worldDistanceFactor);
  var radius = diameter / 2;
  var hit = new hitboxProto(pos, radius, radius, radius);
  var obs = new obstacleProto(
    pos,
    diameter,
    diameter,
    spriteList.goodBubble,
    hit,
    'good'
  );
  return obs;
}
