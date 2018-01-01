import { Obstacle } from './Obstacle';
import { GoodBubble } from './GoodBubble';
import { BadBubble } from './BadBubble';
import { Position } from '../Position';
import { CircularHitBox } from '../HitBoxes/CircularHitBox';

export class ObstacleFactory {
  /**
   * Public methods
   */
  public static createBadBubble(
    position: Position,
    diameter: number
  ): Obstacle {
    let radius: number = diameter / 2;
    let relCenter: Position = new Position(radius, radius);
    let hitbox: CircularHitBox = new CircularHitBox(
      position,
      relCenter,
      radius
    );
    return new BadBubble(position, diameter / 2, hitbox);
  }

  public static createGoodBubble(
    position: Position,
    diameter: number
  ): Obstacle {
    let radius: number = diameter / 2;
    let relCenter: Position = new Position(radius, radius);
    let hitbox: CircularHitBox = new CircularHitBox(
      position,
      relCenter,
      radius
    );
    return new GoodBubble(position, diameter / 2, hitbox);
  }

  /**
   * Private members
   */
  // TODO: move these variables to the  ObstacleManager class
  private static readonly BAD_BUBBLE_PER_SQUARE: number = 3;
  private static readonly GOOD_BUBBLE_PER_SQUARE: number = 3;
  private static readonly FIRST_FILLED_SQUARE_DISTANCE: number = 300;
  private static readonly LAST_FILLED_SQUARE_XW: number = FIRST_FILLED_SQUARE_DISTANCE +
    softozorData.startPosition;
}

// TODO: move these methods to the ObstacleManager class
// stretches a value between 0 and 1 to 0 or 1, symetric relative to 0.5
function approachExtrema01(value: number): number {
  return (3 - 2 * value) * value * value;
}

function approachCenter(value: number): number {
  return ((2 * value - 3) * value + 2) * value;
}
