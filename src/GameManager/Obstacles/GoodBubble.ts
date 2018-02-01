import * as BUBBLE from '../../../assets/banner/goodbubble.png';

import * as CONSTANTS from '../../../config/game/Constants.json';

import Vector2D from '../Math/Vector2D';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import SpriteRenderer from '../SpriteRenderers/DynamicSpriteRenderer';
import CircularObstacle from './CircularObstacle';
import Sprite from '../SpriteRenderers/Sprite';
import Canvas from '../Canvas/Canvas';

export default class GoodBubble extends CircularObstacle {
  constructor(
    canvas: Canvas,
    topLeftCorner: Vector2D,
    radius: number,
    hitbox: CircularHitBox
  ) {
    super(canvas, topLeftCorner, radius, hitbox);
    let diameter: number = 2 * radius;
    this.m_SpriteRenderer = new SpriteRenderer(
      canvas,
      diameter,
      diameter,
      GoodBubble.SPRITE,
      (<any>CONSTANTS).WorldDistanceFactor
    );
  }

  public render(): void {
    let pos: Vector2D = MovingCoordinateSystem.obsPX(
      this.m_TopLeftCorner,
      (<any>CONSTANTS).WorldDistanceFactor
    );
    this.m_SpriteRenderer.draw(1, pos);
  }

  /**
   * Private members
   */
  private static SPRITE: Sprite = createSprite();

  private m_SpriteRenderer: SpriteRenderer;
}

function onImgLoaded(): void {
  console.log(`Loaded sprite ${BUBBLE}.`);
}

function createSprite(): Sprite {
  let result: Sprite = new Sprite();
  result.load(BUBBLE, onImgLoaded);
  return result;
}
