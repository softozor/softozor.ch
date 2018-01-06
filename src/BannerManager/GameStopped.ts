export default class GameStopped {
  constructor() { }

  /**
   * Public methods
   */
  refreshSize: function() {
    this.swidth = spriteList.gameStopped.img.naturalWidth;
    this.sheight = spriteList.gameStopped.img.naturalHeight;
    if (
      this.swidth / this.sheight <=
      banner.widthPX / (banner.heightPX * this.heightRatio)
    ) {
      this.y = banner.heightPX * (1 - this.heightRatio) / 2;
      this.height = banner.heightPX * this.heightRatio;
      this.width = this.height * this.swidth / this.sheight;
      this.x = (banner.widthPX - this.width) / 2;
    } else {
      this.x = 0;
      this.width = banner.widthPX;
      this.height = this.width * this.sheight / this.swidth;
      this.y = (banner.heightPX - this.height) / 2;
    }
  },

  // TODO: call <==> banner.playState === 'paused'
  update: function() {
    if (banner.stateTransition === 0) {

      // make hole in canvas
      banner.ctx.globalCompositeOperation = 'destination-out';
      banner.ctx.drawImage(
        spriteList.gameStopped.img,
        0,
        0,
        this.swidth,
        this.sheight,
        this.x,
        this.y,
        this.width,
        this.height
      );

      // draw background
      banner.ctx.globalCompositeOperation = 'destination-over';
      banner.ctx.drawImage(
        spriteList.gameStoppedBackground.img,
        this.x,
        this.y,
        this.width,
        this.height
      );

      // draw shadow
      banner.ctx.globalCompositeOperation = 'source-over';
      banner.ctx.drawImage(
        spriteList.gameStoppedShadow.img,
        this.sx,
        this.sy,
        this.swidth,
        this.sheight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  /**
   * Private members
   */
  private static HEIGHT_RATIO: number = 0.6;

  private m_Sx: number = 0;
  private m_Sy: number = 0;
  private m_SWidth: number = 0;
  private m_SHeight: number = 0;
  private m_X: number = 0;
  private m_Y: number = 0;
  private m_Width: number = 0;
  private m_Height: number = 0;
}