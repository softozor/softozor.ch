import Canvas from '../Canvas/Canvas';
import MovingObject from '../MovingObject';
import Vector2D from './Vector2D';

let CANVAS: Canvas;
let MOVING_OBJECT: MovingObject;

// TODO: put these numbers in a config file!
export const WORLD_BAND_RATIO_TO_BANNER: number = 2;
export const WORLD_DISTANCE_FACTOR = 1;

export function setCanvas(canvas: Canvas): void {
  CANVAS = canvas;
}

export function setMovingObject(movingObject: MovingObject): void {
  MOVING_OBJECT = movingObject;
}

export function scrollingPosition(): Vector2D {
  let x: number = MOVING_OBJECT.position.x - MOVING_OBJECT.deltaXW;
  let y: number =
    MOVING_OBJECT.position.y *
    (WORLD_BAND_RATIO_TO_BANNER - 1) /
    WORLD_BAND_RATIO_TO_BANNER;
  return new Vector2D(x, y);
}

function obsW(position: Vector2D, distFactor: number): Vector2D {
  if (distFactor === Infinity || distFactor === 0) {
    return position;
  } else {
    return Vector2D.minus(position, scrollingPosition()).times(1 / distFactor);
  }
}

function obsToPX(obs: Vector2D): Vector2D {
  return obs.times(CANVAS.height * WORLD_BAND_RATIO_TO_BANNER / 100);
}

export function obsPX(position: Vector2D, distFactor: number): Vector2D {
  return obsToPX(obsW(position, distFactor));
}
