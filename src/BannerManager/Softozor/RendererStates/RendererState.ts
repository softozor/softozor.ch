import Renderer from '../Renderer';
import Sprite from '../../SpriteRenderers/Sprite';
import Vector2D from '../../Vector2D';

export default class RendererState {
  constructor(
    protected readonly m_Renderer: Renderer,
    private readonly m_Sprite: Sprite
  ) {}

  /**
   * Public methods
   */
  public enter(): void {
    this.m_Renderer.sprite = this.m_Sprite;
  }

  public exit(): void {}
}
