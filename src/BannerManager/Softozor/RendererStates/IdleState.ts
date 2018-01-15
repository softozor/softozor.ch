import IMG from '../../../../assets/banner/softozor.png';

import Renderer from '../Renderer';
import Sprite from '../../SpriteRenderers/Sprite';
import RendererState from './RendererState';

export default class IdleState extends RendererState {
  constructor(renderer: Renderer) {
    super(renderer, new Sprite(IMG));
  }
}
