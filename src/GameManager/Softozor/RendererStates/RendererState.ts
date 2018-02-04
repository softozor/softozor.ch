import Renderer from '../Renderer';
import Sprite from '../../Rendering/Sprite';

export default class RendererState {
  constructor(
    protected readonly m_Renderer: Renderer,
    protected readonly m_Sprite: Sprite
  ) {}

  /**
   * Public methods
   */
  public enter(): void {}

  public exit(): void {}

  public get sprite(): Sprite {
    return this.m_Sprite;
  }

  /**
   * Protected methods
   */
}
