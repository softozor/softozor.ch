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
}
