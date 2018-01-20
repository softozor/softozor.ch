import IMG from '../../../../assets/banner/softozor_flap2.png';

import Renderer from '../Renderer';
import Sprite from '../../SpriteRenderers/Sprite';
import RendererState from './RendererState';

export default class Flap2State extends RendererState {
  constructor(renderer: Renderer) {
    super(renderer, new Sprite(IMG));
  }
}
