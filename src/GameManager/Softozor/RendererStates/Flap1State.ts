import IMG from '../../../../assets/banner/softozor_flap1.png';

import Renderer from '../Renderer';
import Sprite from '../../SpriteRenderers/Sprite';
import RendererState from './RendererState';

export default class Flap1State extends RendererState {
  constructor(renderer: Renderer) {
    super(renderer, new Sprite(IMG, onImgLoaded));
  }
}

function onImgLoaded(): void {
  console.log(`Loaded sprite ${IMG}.`);
}
