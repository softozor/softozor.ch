import Obstacle from './Obstacle';
import GoodBubble from './GoodBubble';
import BadBubble from './BadBubble';
import Position from '../Position';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import Canvas from '../Canvas';

export default class ObstacleFactory {
  /**
   * Public methods
   */
  public static createBadBubble(
    canvas: Canvas,
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
    return new BadBubble(canvas, position, diameter / 2, hitbox);
  }

  public static createGoodBubble(
    canvas: Canvas,
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
    return new GoodBubble(canvas, position, diameter / 2, hitbox);
  }
}
