import Renderer from '../Renderer';
import Sprite from '../../Rendering/Sprite';

export default class RendererState {
  constructor(protected readonly m_Renderer: Renderer) {}

  /**
   * Public methods
   */
  public get sprite(): Sprite {
    return this.m_Sprite;
  }

  public load(sprite: Sprite): void {
    this.m_Sprite = sprite;
  }

  public enter(): void {}

  public exit(): void {}

  /**
   * Protected methods
   */

  /**
   * Private members
   */
  protected m_Sprite: Sprite = new Sprite();
}
