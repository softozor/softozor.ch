import * as IMG from '../../../assets/banner/play_pause.png';
import * as CONFIG from '../../../config/game/Buttons/Play.json';

import Button from './Button';
import Canvas from '../Canvas/Canvas';
import Sprite from '../Rendering/Sprite';

type ButtonReadyCallback = () => void;

export default class PlayButton extends Button {
  constructor(
    canvas: Canvas,
    callback: ButtonReadyCallback,
    x: number = (<any>CONFIG).x,
    y: number = (<any>CONFIG).y,
    width: number = (<any>CONFIG).width,
    height: number = (<any>CONFIG).height,
    clickDelta: number = (<any>CONFIG).clickDelta
  ) {
    super(canvas, x, y, width, height, clickDelta);
    this.m_Sprite.load(IMG, callback);
  }

  /**
   * Public methods
   */
  // TODO: add an animate method here which animates from xN = 0 to 600 and vice-versa with toggle mechanism
  // TODO: animate this button as it was done in the old code
  // it must show the transition between the sprites as depicted
  // in the play_pause.png image
  // The button should be animated during the state transition from
  // 'paused' to 'running' and vice-versa!
  // We don't need the actual state; we only need to initialize this
  // position at the correct button (xN = 0 ==> pause; xN = 600 ==> play)
  // and then just toggle the direction!
  // The animation must be done here in this "animate()" method!

  public draw(alpha: number): void {
    // The animation shouldn't be done in this draw method because each time we re-render the button,
    // the animation gets played, which is not what we want! Instead, it must remember at what xN it stayed
    // and render the button with that xN value!
    this.m_Canvas.context.globalAlpha = alpha;
    let xN: number = 600;
    // xN = 600 ==> play button
    // xN = 0 ==> pause button
    // available via CONFIG.playPosition / CONFIG.pausePosition

    this.m_Canvas.context.drawImage(
      this.m_Sprite.img,
      xN,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  /**
   * Protected methods
   */
  protected get y(): number {
    return this.m_Canvas.height - (<any>CONFIG).bottomMargin - this.height;
  }

  /**
   * Private members
   */
}
