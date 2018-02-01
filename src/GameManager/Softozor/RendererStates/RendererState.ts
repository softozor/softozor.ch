import Renderer from '../Renderer';
import Sprite from '../../SpriteRenderers/Sprite';
import Vector2D from '../../Math/Vector2D';

export default class RendererState {
  constructor(protected readonly m_Renderer: Renderer) {}

  /**
   * Public methods
   */
  public enter(): void {
    this.m_Renderer.sprite = this.m_Sprite;
  }

  public exit(): void {}

  /**
   * Protected methods
   */
  protected readonly m_Sprite: Sprite = new Sprite();
}
