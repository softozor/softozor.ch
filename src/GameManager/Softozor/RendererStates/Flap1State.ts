import * as IMG from '../../../../assets/banner/softozor_flap1.png';

import Renderer from '../Renderer';
import Sprite from '../../SpriteRenderers/Sprite';
import RendererState from './RendererState';

export default class Flap1State extends RendererState {
  constructor(renderer: Renderer) {
    super(renderer);
    this.m_Sprite.load(IMG, onImgLoaded);
  }
}

/**
 * Non-member methods
 */
function onImgLoaded(): void {
  console.log(`Loaded sprite ${IMG}.`);
}
