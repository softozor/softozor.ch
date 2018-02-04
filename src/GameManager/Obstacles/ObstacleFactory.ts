import Obstacle from './Obstacle';
import GoodBubble from './GoodBubble';
import BadBubble from './BadBubble';
import Position from '../Math/Vector2D';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import Canvas from '../Canvas/Canvas';
import Vector2D from '../Math/Vector2D';

export default class ObstacleFactory {
  /**
   * Public methods
   */
  public static createBadBubble(
    canvas: Canvas,
    position: Vector2D,
    diameter: number
  ): Obstacle {
    let radius: number = diameter / 2;
    let relCenter: Vector2D = new Vector2D(radius, radius);
    let hitbox: CircularHitBox = new CircularHitBox(
      position,
      relCenter,
      radius
    );
    return new BadBubble(canvas, position, diameter / 2, hitbox);
  }

  public static createGoodBubble(
    canvas: Canvas,
    position: Vector2D,
    diameter: number
  ): Obstacle {
    let radius: number = diameter / 2;
    let relCenter: Vector2D = new Vector2D(radius, radius);
    let hitbox: CircularHitBox = new CircularHitBox(
      position,
      relCenter,
      radius
    );
    return new GoodBubble(canvas, position, diameter / 2, hitbox);
  }
}
