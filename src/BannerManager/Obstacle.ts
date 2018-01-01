import { Position } from './Position';
import { HitBox } from './HitBox';
import { SpriteRenderer } from './SpriteRenderer';
import { Collision } from './Collision';

export abstract class Obstacle {
  constructor(
    private readonly m_Position: Position,
    private readonly m_WidthW: number,
    private readonly m_HeightW: number,
    private readonly m_Hitbox: HitBox
  ) {}

  // this.spriteRenderer = new spriteRendererProto(
  //   sprite,
  //   widthW,
  //   heightW,
  //   position.distanceFactor
  // );

  /**
   * Getters / setters
   */

  get hasCollided(): Boolean {
    return this.m_HasCollided;
  }

  /**
   * Public methods
   */

  public update(): void {
    this.render();
  }

  public refreshSize(): void {
    this.m_SpriteRenderer.refreshSize();
  }

  public collide(hitBox: HitBox): Collision | undefined {
    let collision: Collision | undefined = this.m_Hitbox.collide(hitBox);
    if (collision !== undefined) {
      this.m_HasCollided = true;
      return collision;
    }
    return undefined;
  }

  public isOutOfBounds(scrollingXW: number): Boolean {
    return this.m_Position.x + this.m_SpriteRenderer.widthW <= scrollingXW;
  }

  /**
   * Private methods
   */

  private render(): void {
    this.m_SpriteRenderer.draw(this.m_Position.xObsPX, this.m_Position.yObsPX);
  }

  /**
   * Private members
   */
  private m_SpriteRenderer: SpriteRenderer;
  private m_HasCollided: Boolean = false;
}
