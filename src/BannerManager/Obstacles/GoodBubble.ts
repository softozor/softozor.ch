import { Position } from '../Position';
import { CircularHitBox } from '../HitBoxes/CircularHitBox';
import { SpriteRenderer } from '../SpriteRenderer';
import { CircularObstacle } from './CircularObstacle';
import { Sprite } from '../Sprite';

import BUBBLE from '../../../assets/banner/goodbubble.png';

export class GoodBubble extends CircularObstacle {
  constructor(position: Position, radius: number, hitbox: CircularHitBox) {
    super(position, radius, hitbox);
    let diameter: number = 2 * radius;
    let sprite: Sprite = new Sprite(BUBBLE);
    // TODO: attach BannerManager::refreshSize(); BannerManager::update();
    // probably add an abstract attachObstacleLoadedEvent
    // sprite.attachImgLoadedEvent();
    this.m_SpriteRenderer = new SpriteRenderer(
      sprite,
      diameter,
      diameter,
      worldDistanceFactor
    );
  }

  /**
   * Getters / setters
   */

  /**
   * Public methods
   */

  public refreshSize(): void {
    this.m_SpriteRenderer.refreshSize();
  }

  /**
   * Private methods
   */

  protected render(): void {
    this.m_SpriteRenderer.draw(this.m_Position.xObsPX, this.m_Position.yObsPX);
  }

  /**
   * Private members
   */
  private m_SpriteRenderer: SpriteRenderer;
}
