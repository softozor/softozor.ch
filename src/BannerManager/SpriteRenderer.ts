function spriteRendererProto(sprite, widthW, heightW, distanceFactor) {
  this.sprite = sprite;
  this.distanceFactor = distanceFactor;
  this.widthW = widthW;
  this.heightW = heightW;

  this.draw = function(x0PX, y0PX) {
    var sx, sy, swidth, sheight, x, y, width, height;

    var mustBeDrawn = true;
    var scrollXPX = scrollingPosition.xObsPX();
    var scrollYPX = scrollingPosition.yObsPX();

    if (x0PX <= -this.widthPX) {
      mustBeDrawn = false;
    } else if (x0PX <= 0) {
      x = 0;
      width = Math.min(banner.widthPX, this.widthPX + x0PX);
      sx = -x0PX * this.widthPXToN;
      swidth = width * this.widthPXToN;
    } else if (x0PX <= scrollXPX + banner.widthPX - this.widthPX) {
      x = x0PX;
      width = Math.min(banner.widthPX - x0PX, this.widthPX);
      sx = 0;
      swidth = width * this.widthPXToN;
    } else if (x0PX < scrollXPX + banner.widthPX) {
      x = x0PX;
      width = banner.widthPX - x0PX;
      sx = 0;
      swidth = width * this.widthPXToN;
    } else {
      mustBeDrawn = false;
    }

    if (y0PX <= -this.heightPX) {
      mustBeDrawn = false;
    } else if (y0PX <= 0) {
      y = 0;
      height = Math.min(banner.heightPX, this.heightPX + y0PX);
      sy = -y0PX * this.heightPXToN;
      sheight = height * this.heightPXToN;
    } else if (y0PX <= scrollYPX + banner.heightPX - this.heightPX) {
      y = y0PX;
      height = Math.min(banner.heightPX - y0PX, this.heightPX);
      sy = 0;
      sheight = height * this.heightPXToN;
    } else if (y0PX < scrollYPX + banner.heightPX) {
      y = y0PX;
      height = banner.heightPX - y0PX;
      sy = 0;
      sheight = height * this.heightPXToN;
    } else {
      mustBeDrawn = false;
    }

    if (mustBeDrawn) {
      banner.ctx.drawImage(
        this.sprite.img,
        sx,
        sy,
        swidth,
        sheight,
        x,
        y,
        width,
        height
      );
    }
  };

  this.refreshSize = function() {
    if (this.distanceFactor === 0 || this.distanceFactor === Infinity) {
      this.heightPX = this.heightW;
      this.widthPX = this.widthW;
    } else {
      this.heightPX =
        this.heightW *
        worldBandRatioToBanner *
        banner.heightPX /
        100 /
        this.distanceFactor;
      this.widthPX =
        this.widthW *
        worldBandRatioToBanner *
        banner.heightPX /
        100 /
        this.distanceFactor;
    }

    this.widthPXToN = this.sprite.img.naturalWidth / this.widthPX;
    this.heightPXToN = this.sprite.img.naturalHeight / this.heightPX;
  };
}
