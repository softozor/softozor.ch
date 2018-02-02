import { map, forEach } from 'lodash';

import * as SKY_IMG from '../../../assets/banner/sky.png';
import * as CLOUDS_IMG from '../../../assets/banner/clouds.png';
import * as BACK_IMG from '../../../assets/banner/back.png';
import * as MID_IMG from '../../../assets/banner/mid.png';
import * as FRONT_IMG from '../../../assets/banner/front.png';
import * as WORLD_BAND_IMG from '../../../assets/banner/worldBand.png';

import Canvas from '../Canvas/Canvas';
import BandRenderer from './BandRenderer';
import Vector2D from '../Math/Vector2D';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';
import SpriteListLoader, {
  SpriteList,
  DistantSprite,
  DistantImgList
} from '../SpriteRenderers/SpriteListLoader';

export default class ParallaxManager {
  constructor(private readonly m_Canvas: Canvas) {
    const loader: SpriteListLoader = new SpriteListLoader(
      images(),
      this.onImagesLoaded.bind(this)
    );
  }

  /**
   * Public methods
   */
  public tick(): void {
    this.render();
  }

  public render(): void {
    console.log('rendering parallax');
    forEach(this.m_BandRenderers, element => this.renderBand(element));
  }

  /**
   * Private methods
   */
  private onImagesLoaded(sprites: SpriteList): void {
    sprites.sort(compareDescendingDistanceFactors);
    this.m_BandRenderers = map(sprites, (element: DistantSprite) => {
      return new BandRenderer(
        this.m_Canvas,
        element.sprite.naturalWidth,
        element.sprite.naturalHeight,
        element.sprite,
        element.distanceFactor
      );
    });
  }

  private renderBand(bandRenderer: BandRenderer): void {
    let distFact: number = bandRenderer.distanceFactor;
    let origin: Vector2D = new Vector2D(0, 0);
    let pos0PX: Vector2D = MovingCoordinateSystem.obsPX(origin, distFact);
    while (pos0PX.x <= this.m_Canvas.width) {
      bandRenderer.draw(1, pos0PX);
      pos0PX.x += bandRenderer.widthPX;
    }
  }

  /**
   * Private members
   */
  private m_BandRenderers: BandRenderer[];
}

/**
 * Non-member methods
 */
function images(): DistantImgList {
  return [
    { imgSrc: SKY_IMG, distanceFactor: Infinity },
    { imgSrc: CLOUDS_IMG, distanceFactor: 16 },
    { imgSrc: BACK_IMG, distanceFactor: 8 },
    { imgSrc: MID_IMG, distanceFactor: 4 },
    { imgSrc: FRONT_IMG, distanceFactor: 2 },
    { imgSrc: WORLD_BAND_IMG, distanceFactor: 1 }
  ];
}

function compareDescendingDistanceFactors(
  val1: DistantSprite,
  val2: DistantSprite
): number {
  if (val1.distanceFactor < val2.distanceFactor) {
    return 1;
  } else if (val1.distanceFactor > val2.distanceFactor) {
    return -1;
  }
  return 0;
}
