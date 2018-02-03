import Renderer from '../Renderer';
import Sprite from '../../Rendering/Sprite';
import RendererState from './RendererState';

export default class IdleState extends RendererState {
  constructor(renderer: Renderer, sprite: Sprite) {
    super(renderer, sprite);
  }
}

/**
 * Non-member methods
 */
