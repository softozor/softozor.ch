import Renderer from '../Renderer';
import Sprite from '../../SpriteRenderers/Sprite';
import RendererState from './RendererState';

export default class Flap2State extends RendererState {
  constructor(renderer: Renderer, sprite: Sprite) {
    super(renderer, sprite);
  }
}

/**
 * Non-member methods
 */
