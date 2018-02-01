import * as CONSTANTS from '../../../config/game/Constants.json';

import Canvas from '../Canvas/Canvas';
import MovingObject from '../MovingObject';
import Vector2D from './Vector2D';
import Size from './Size';

let CANVAS: Canvas;
let MOVING_OBJECT: MovingObject;

export function setCanvas(canvas: Canvas): void {
  CANVAS = canvas;
}

export function canvas(): Canvas {
  return CANVAS;
}

export function setMovingObject(movingObject: MovingObject): void {
  MOVING_OBJECT = movingObject;
}

export function movingObject(): MovingObject {
  return MOVING_OBJECT;
}

export function scrollingPosition(): Vector2D {
  let ratio: number = (<any>CONSTANTS).WorldBandRatioToBanner;
  let x: number = MOVING_OBJECT.position.x - MOVING_OBJECT.deltaXW;
  let y: number = MOVING_OBJECT.position.y * (ratio - 1) / ratio;
  return new Vector2D(x, y);
}

function obsW(position: Vector2D, distFactor: number): Vector2D {
  if (distFactor === Infinity || distFactor === 0) {
    return position;
  }
  return Vector2D.minus(position, scrollingPosition()).times(1 / distFactor);
}

function obsToPX(obs: Vector2D): Vector2D {
  let ratio: number = (<any>CONSTANTS).WorldBandRatioToBanner;
  let unit: number = (<any>CONSTANTS).BannerUnit;
  return obs.times(CANVAS.height * ratio / unit);
}

export function obsPX(position: Vector2D, distFactor: number): Vector2D {
  return obsToPX(obsW(position, distFactor));
}

export function obsSizePX(size: Size, distFactor: number): Size {
  if (distFactor === Infinity || distFactor === 0) {
    return size;
  }
  let ratio: number = (<any>CONSTANTS).WorldBandRatioToBanner;
  let unit: number = (<any>CONSTANTS).BannerUnit;
  return size.times(CANVAS.height * ratio / (unit * distFactor));
}

export function obsLengthPX(length: number, distFactor: number): number {
  if (distFactor === Infinity || distFactor === 0) {
    return length;
  }
  let ratio: number = (<any>CONSTANTS).WorldBandRatioToBanner;
  let unit: number = (<any>CONSTANTS).BannerUnit;
  return length * CANVAS.height * ratio / (unit * distFactor);
}
