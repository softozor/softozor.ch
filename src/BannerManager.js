import SKY_IMG from '../assets/banner/sky.png';
import CLOUDS_IMG from '../assets/banner/clouds.png';
import BACK_IMG from '../assets/banner/back.png';
import MID_IMG from '../assets/banner/mid.png';
import FRONT_IMG from '../assets/banner/front.png';
import WORLD_BAND_IMG from '../assets/banner/worldBand.png';
import SOFTOZOR_IDLE_IMG from '../assets/banner/softozor.png';
import SOFTOZOR_FLAP1_IMG from '../assets/banner/softozor_flap1.png';
import SOFTOZOR_FLAP2_IMG from '../assets/banner/softozor_flap2.png';
import GAME_STOPPED_IMG from '../assets/banner/gameStopped.png';
import GAME_STOPPED_SHADOW_IMG from '../assets/banner/gameStopped_shadow.png';
import GAME_STOPPED_BACKGROUND_IMG from '../assets/banner/gameStopped_background.png';
import GOOD_BUBBLE_IMG from '../assets/banner/goodbubble.png';
import BAD_BUBBLE_IMG from '../assets/banner/badbubble.png';
import PLAY_PAUSE_IMG from '../assets/banner/play_pause.png';
import RESTART_IMG from '../assets/banner/restart.png';

('use strict');

function spriteProto(src) {
  this.img = new Image();

  this.img.isLoaded = false;
  this.img.onload = function() {
    this.isLoaded = true;
    refreshSize();
    update();
  };
  this.img.src = src;
}

var spriteList = {
  initialize: function() {
    this.sky = new spriteProto(SKY_IMG);
    this.clouds = new spriteProto(CLOUDS_IMG);
    this.back = new spriteProto(BACK_IMG);
    this.mid = new spriteProto(MID_IMG);
    this.front = new spriteProto(FRONT_IMG);
    this.world = new spriteProto(WORLD_BAND_IMG);
    this.softozorIdle = new spriteProto(SOFTOZOR_IDLE_IMG);
    this.softozorFlap1 = new spriteProto(SOFTOZOR_FLAP1_IMG);
    this.softozorFlap2 = new spriteProto(SOFTOZOR_FLAP2_IMG);
    this.gameStopped = new spriteProto(GAME_STOPPED_IMG);
    this.gameStoppedShadow = new spriteProto(GAME_STOPPED_SHADOW_IMG);
    this.gameStoppedBackground = new spriteProto(GAME_STOPPED_BACKGROUND_IMG);
    this.goodBubble = new spriteProto(GOOD_BUBBLE_IMG);
    this.badBubble = new spriteProto(BAD_BUBBLE_IMG);
    this.playPause = new spriteProto(PLAY_PAUSE_IMG);
    this.restart = new spriteProto(RESTART_IMG);

    // visual reference for hitbox. Must be commentar in final game
    //this.hitSpot = new spriteProto('../assets/banner/redCircle.png');
  }
};

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

/* The html tag which will contain the banner must:
		- have the attribute:	id="banner"
		- have a proper height
*/

// Softozor data
const softozorData = {
  alt: 'Softozor',
  originalDeltaXW: 50, // right shift in *W units
  startPosition: 500, // original x position of scrolling
  widthW: 17, // sprite size in world coordinates
  heightW: 10, // sprite size in world coordinates
  minYW: 0,
  originalYW: 70,
  maxYW: 100,
  originalXSpeed: 0.4,
  gravity: 0.05,
  flapStrength: 0.9,
  flapDelay: 10,
  hitDownSpeed: 0.1,
  minSpeed: -1.2,
  maxSpeed: 0.8
};

// bubble values
var badBubblePerSquare = 3;
var goodBubblePerSquare = 3;
const firstFilledSquareDistance = 300;
var lastFilledSquareXW = firstFilledSquareDistance + softozorData.startPosition;

// score values
var score = 0;
var scoreIncrement = 1;

// world values
const worldDistanceFactor = 1;
const worldBandRatioToBanner = 2;
const worldBandIndex = 0;

// band values
var band = [];

// banner values
var banner = {
  // game frame pilot
  runSpeed: undefined,
  frameTime: 20,

  gameState: 'on', // on / over / restarting
  gameEndingTransition: 1, // transition reference: 0 = stopped, 1 = started

  playState: 'paused', // running / pausing / paused / starting
  stateTransition: 0, // transition reference: 0 = stopped, 1 = started

  initialize: function() {
    this.canvas = $('#banner > canvas')[0];
    this.ctx = this.canvas.getContext('2d');

    this.canvas.onmousedown = this.handleMouseDown;
    this.canvas.onmouseup = this.handleMouseUp;
    this.canvas.ontouchstart = this.handleMouseDown;
    this.canvas.ontouchend = this.handleMouseUp;

    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;

    var isChrome = !!window.chrome && !!window.chrome.webstore;
    if (!isChrome) {
      this.canvas.onmouseenter = () => banner.run();
      this.canvas.onmouseleave = () => banner.pause();
    }
  },

  reInitialize: function() {
    this.gameState = 'on';
    this.gameEndingTransition = 1;
    obstacle = [];
    scorePop = [];
    scrollingPosition.xW = softozorData.startPosition;
    softozor.position.yW =
      softozorData.originalYW - softozorData.heightW * worldBandRatioToBanner;
    softozor.updatePosition();
    softozor.ySpeed = softozorData.minSpeed;
    softozor.deltaXW = softozorData.originalDeltaXW;
    softozor.flapWait = 0;
    softozor.deltaXSpeed = 0;
    lastFilledSquareXW = firstFilledSquareDistance + softozorData.startPosition;
    score = 0;
    scoreIncrement = 1;
  },

  restart: function() {
    this.gameState = 'restarting';
    obstacle = [];
    scorePop = [];
    this.restartScore = score;
    this.restartScrollingXW = scrollingPosition.xW;
    this.restartSoftozorDeltaXW = softozor.deltaXW;
    this.restartSoftozorYW = softozor.position.yW;
    softozor.flapWait = 0;
    softozor.deltaXSpeed = 0;
    lastFilledSquareXW = firstFilledSquareDistance + softozorData.startPosition;
    score = 0;
    scoreIncrement = 1;
  },

  refreshSize: function() {
    this.widthPX = $('#banner').width();
    this.heightPX = $('#banner').height();
    this.canvas.width = this.widthPX;
    this.canvas.height = this.heightPX;
  },

  // run the game
  run: function() {
    clearInterval(banner.runSpeed);
    banner.runSpeed = setInterval(update, this.frameTime);
    this.playState = 'starting';
  },

  // stop the game
  pause: function() {
    this.playState = 'pausing';
  },

  // transition between game started and game stopped
  transitionUpdate: function() {
    if (this.playState === 'paused') {
    } else if (this.playState === 'pausing') {
      if (this.stateTransition > 0)
        this.stateTransition = Math.max(0, this.stateTransition - 0.03);
      else {
        this.playState = 'paused';
        clearInterval(banner.runSpeed);
      }
    } else if (this.playState === 'running') {
    } else if (this.playState === 'starting') {
      if (this.stateTransition < 1)
        this.stateTransition = Math.min(1, this.stateTransition + 0.03);
      else this.playState = 'running';
    }

    if (this.gameState === 'over' && this.gameEndingTransition > 0) {
      this.gameEndingTransition = Math.max(this.gameEndingTransition - 0.02, 0);
    }

    if (this.gameState === 'restarting') {
      if (this.gameEndingTransition < 1) {
        this.gameEndingTransition = Math.min(
          this.gameEndingTransition + 0.01,
          1
        );
        score = Math.round(this.restartScore * (1 - this.gameEndingTransition));
        scrollingPosition.xW =
          (softozorData.startPosition - this.restartScrollingXW) *
            this.gameEndingTransition +
          this.restartScrollingXW;
        softozor.deltaXW =
          (softozorData.originalDeltaXW - this.restartSoftozorDeltaXW) *
            this.gameEndingTransition +
          this.restartSoftozorDeltaXW;
        softozor.position.yW =
          (softozorData.originalYW -
            softozorData.heightW * worldBandRatioToBanner -
            this.restartSoftozorYW) *
            this.gameEndingTransition +
          this.restartSoftozorYW;
        softozor.updatePosition();
      } else {
        this.gameState = 'on';
        banner.reInitialize();
      }
    }
  },

  handleEventPosition: function(evt) {
    if (
      evt.clientX >= playButton.xPX - playButton.clickDeltaPX &&
      evt.clientX <=
        playButton.xPX + playButton.widthPX + playButton.clickDeltaPX &&
      evt.clientY >= playButton.yPX - playButton.clickDeltaPX &&
      evt.clientY <=
        playButton.yPX + playButton.heightPX + playButton.clickDeltaPX
    ) {
      return 'playButton';
    } else if (
      banner.gameState === 'over' &&
      evt.clientX >= restartButton.xPX - restartButton.clickDeltaPX &&
      evt.clientX <=
        restartButton.xPX +
          restartButton.widthPX +
          restartButton.clickDeltaPX &&
      evt.clientY >= restartButton.yPX - restartButton.clickDeltaPX &&
      evt.clientY <=
        restartButton.yPX + restartButton.heightPX + restartButton.clickDeltaPX
    ) {
      return 'restartButton';
    } else {
      return 'banner';
    }
  },

  handleKeyDown: function(event) {
    switch (event.keyCode) {
    case 32: //space
      softozor.startFlap();
      break;
    case 27: //esc
      playButton.click();
    default:
      break;
    }
  },

  handleKeyUp: function(event) {
    switch (event.keyCode) {
    case 32: //space
      softozor.stopFlap();
      break;
    default:
      break;
    }
  },

  handleMouseDown: function(event) {
    //event.preventDefault();
    if (banner.handleEventPosition(event) === 'banner') {
      softozor.startFlap();
    }
  },

  handleMouseUp: function(event) {
    //event.preventDefault();
    var zone = banner.handleEventPosition(event);
    if (zone === 'playButton') {
      playButton.click();
    } else if (zone === 'restartButton') {
      restartButton.click();
    } else {
      softozor.stopFlap();
    }
  }
};

var playButton = {
  xPX: 5,
  yPX: 5,
  yBottomPX: 5,
  widthPX: 50,
  heightPX: 50,
  clickDeltaPX: 50,

  click: function() {
    if (banner.playState === 'paused' || banner.playState === 'pausing') {
      banner.run();
    } else if (
      banner.playState === 'starting' ||
      banner.playState === 'running'
    ) {
      banner.pause();
    }
    console.log(softozor);
  },

  update: function() {
    var xN =
      600 -
      50 *
        Math.round(
          Math.max(Math.min((1 - banner.stateTransition - 0.3) / 0.4, 1), 0) *
            12
        );
    banner.ctx.drawImage(
      spriteList.playPause.img,
      xN,
      0,
      50,
      50,
      this.xPX,
      this.yPX,
      this.widthPX,
      this.heightPX
    );
  },

  refreshSize: function() {
    this.yPX = banner.heightPX - this.yBottomPX - this.heightPX;
  }
};

var restartButton = {
  xPX: 5,
  xRightPX: 5,
  yPX: 5,
  yBottomPX: 5,
  widthPX: 50,
  heightPX: 50,
  clickDeltaPX: 50,

  click: function() {
    if (banner.gameState === 'over' && banner.gameEndingTransition <= 0) {
      banner.run();
      banner.restart();
    }
  },

  update: function() {
    if (banner.gameState === 'over' || banner.gameState === 'restarting') {
      banner.ctx.globalAlpha = 1 - banner.gameEndingTransition;
      banner.ctx.drawImage(
        spriteList.restart.img,
        this.xPX,
        this.yPX,
        this.widthPX,
        this.heightPX
      );
    }
  },

  refreshSize: function() {
    this.xPX = banner.widthPX - this.xRightPX - this.widthPX;
    this.yPX = banner.heightPX - this.yBottomPX - this.heightPX;
  }
};

// prototype of one layer of the banner
function bandProto(sprite, distanceFactor) {
  this.spriteRenderer = new spriteRendererProto(
    sprite,
    2000,
    200,
    distanceFactor
  );
  this.distanceFactor = distanceFactor;
  this.position = new positionProto(0, 0, distanceFactor);

  this.update = function() {
    if (this.position.xW + this.widthW < scrollingPosition.xW)
      this.position.xW += this.widthW;

    var x0PX = this.position.xObsPX();
    var y0PX = this.position.yObsPX();
    while (x0PX <= banner.widthPX) {
      this.spriteRenderer.draw(x0PX, y0PX);
      x0PX += this.spriteRenderer.widthPX;
    }
  };

  this.refreshSize = function() {
    if (this.distanceFactor === Infinity || this.distanceFactor === 0) {
      this.spriteRenderer.heightW = banner.heightPX;
    } else {
      this.spriteRenderer.heightW =
        (worldBandRatioToBanner - 1 + this.distanceFactor) *
        100 /
        worldBandRatioToBanner;
    }
    this.spriteRenderer.widthW =
      this.spriteRenderer.heightW *
      this.spriteRenderer.sprite.img.naturalWidth /
      this.spriteRenderer.sprite.img.naturalHeight;
    this.spriteRenderer.refreshSize();
  };
}

// Softozor
var softozor = {
  position: undefined,
  deltaXW: softozorData.originalDeltaXW,
  deltaXSpeed: 0,
  xSpeed: softozorData.originalXSpeed,
  ySpeed: softozorData.minSpeed,
  flapWait: 0,
  spriteRenderer: undefined,
  hitbox: undefined,
  doFlap: false,

  initialize: function() {
    this.position = new positionProto(
      scrollingPosition.xW + this.deltaXW,
      softozorData.originalYW - softozorData.heightW * worldBandRatioToBanner,
      worldDistanceFactor
    );

    this.spriteRenderer = new spriteRendererProto(
      spriteList.softozorIdle,
      softozorData.widthW,
      softozorData.heightW,
      worldDistanceFactor
    );

    this.updatePosition();

    this.hitbox = new hitboxProto(
      this.position,
      softozorData.widthW * 0.5,
      softozorData.heightW * 0.65,
      softozorData.heightW * 0.3
    );
  },

  updatePosition: function() {
    this.position.xW = scrollingPosition.xW + this.deltaXW;
    scrollingPosition.yW =
      (worldBandRatioToBanner - 1) * this.position.yW / worldBandRatioToBanner;
  },

  graphicUpdate: function() {
    if (banner.gameState === 'on' || banner.gameState === 'restarting') {
      if (this.flapWait >= softozorData.flapDelay - 3) {
        this.spriteRenderer.sprite = spriteList.softozorFlap1;
      } else if (this.flapWait >= softozorData.flapDelay - 6) {
        this.spriteRenderer.sprite = spriteList.softozorFlap2;
      } else {
        this.spriteRenderer.sprite = spriteList.softozorIdle;
      }
      this.spriteRenderer.draw(this.position.xObsPX(), this.position.yObsPX());

      // Visual reference for hitbox setup. Must be commentar in final game.
      //this.hitbox.testUpdate();
    }
  },

  physicUpdate: function() {
    this.fall();
    this.moveForward();
    this.flap();
    this.updatePosition();
    if (this.flapWait > 0) this.flapWait -= banner.stateTransition;

    if (banner.gameState === 'on') {
      this.hitCheck();
      this.checkOut();
    }
  },

  // constant fall
  fall: function() {
    if (
      this.position.yW >
      softozorData.maxYW - softozorData.heightW * worldBandRatioToBanner
    ) {
      this.ySpeed = Math.min(this.ySpeed, 0);
    } else if (this.position.yW > softozorData.minYW) {
      this.ySpeed += softozorData.gravity * banner.stateTransition;
    } else {
      this.ySpeed = Math.max(this.ySpeed, softozorData.hitDownSpeed);
      this.ySpeed += softozorData.gravity * banner.stateTransition;
    }
    this.ySpeed = Math.min(
      Math.max(this.ySpeed, softozorData.minSpeed),
      softozorData.maxSpeed
    );
    this.position.yW += this.ySpeed * banner.stateTransition;
  },

  // flap up
  flap: function() {
    if (
      this.doFlap &&
      this.position.yW > softozorData.minYW &&
      this.flapWait <= 0
    ) {
      if (banner.gameState === 'on') {
        this.ySpeed -= softozorData.flapStrength;
        this.flapWait = softozorData.flapDelay;
      } else {
        this.ySpeed -= softozorData.flapStrength / softozorData.flapDelay;
      }
    }
  },

  startFlap: function() {
    this.doFlap = true;
  },

  stopFlap: function() {
    this.doFlap = false;
  },

  moveForward: function() {
    if (banner.gameState === 'on')
      this.xSpeed = softozorData.originalXSpeed + scrollingPosition.xW / 10000;
    scrollingPosition.xW += this.xSpeed * banner.stateTransition;
    this.deltaXW += this.deltaXSpeed * banner.stateTransition;
    this.deltaXSpeed *= 0.9;
  },

  // hit check
  hitCheck: function() {
    var length = obstacle.length;
    for (var obstacleIndex = 0; obstacleIndex < length; obstacleIndex++) {
      var collision = this.hitbox.testHit(obstacle[obstacleIndex].hitbox);
      if (collision.type === true) {
        if (obstacle[obstacleIndex].type === 'bad') {
          var dx = collision.hitXW - collision.centerXW;
          var dy = collision.hitYW - collision.centerYW;
          var speedChangeFactor =
            2 *
            ((this.deltaXSpeed + this.xSpeed) * dx + this.ySpeed * dy) /
            (dx * dx + dy * dy);
          this.deltaXSpeed -= dx * speedChangeFactor;
          this.ySpeed -= dy * speedChangeFactor;
          scorePop[scorePop.length] = new scorePopProto('xxx');
          scoreIncrement = 1;
        } else if (obstacle[obstacleIndex].type === 'good') {
          scorePop[scorePop.length] = new scorePopProto(scoreIncrement);
          score += scoreIncrement;
          scoreIncrement++;
        }
        obstacle[obstacleIndex].mustBeDestroyed = true;
      }
    }
  },

  checkOut: function() {
    if (this.deltaXW + softozorData.heightW <= 0) {
      banner.gameState = 'over';
    }
  },

  refreshSize: function() {
    this.spriteRenderer.refreshSize();
  }
};

var scrollingPosition = new positionProto(
  softozorData.startPosition,
  (worldBandRatioToBanner - 1) * softozorData.maxYW / worldBandRatioToBanner,
  worldDistanceFactor
);

/* position convention
	*W : units in % of worldBand height
	*PX: units in banner pixels
  *N: units in source pixels
*/
// position prototype
function positionProto(xW, yW, distanceFactor) {
  this.xW = xW;
  this.yW = yW;
  this.distanceFactor = distanceFactor;

  this.xObsW = function() {
    if (this.distanceFactor === Infinity || this.distanceFactor === 0)
      return xW;
    else return (this.xW - scrollingPosition.xW) / this.distanceFactor;
  };

  this.yObsW = function() {
    if (this.distanceFactor === Infinity || this.distanceFactor === 0)
      return yW;
    else return (this.yW - scrollingPosition.yW) / this.distanceFactor;
  };

  function obsToPX(obs) {
    return obs * banner.heightPX * worldBandRatioToBanner / 100;
  }

  this.xObsPX = function() {
    return obsToPX(this.xObsW(this.xW));
  };

  this.yObsPX = function() {
    return obsToPX(this.yObsW(this.yW));
  };
}

// obstacle
var obstacle = [];

function obstacleProto(position, widthW, heightW, sprite, hitbox, type) {
  this.position = position;
  this.spriteRenderer = new spriteRendererProto(
    sprite,
    widthW,
    heightW,
    position.distanceFactor
  );
  this.hitbox = hitbox;
  this.mustBeDestroyed = false;
  this.type = type;

  this.update = function() {
    this.spriteRenderer.draw(this.position.xObsPX(), this.position.yObsPX());
    this.checkOut();
    // Visual reference for hitbox setup. Must be commentar in final game.
    //this.hitbox.testUpdate();
  };

  this.checkOut = function() {
    if (
      this.position.xW + this.spriteRenderer.widthW <= scrollingPosition.xW &&
      softozor.deltaXW + softozorData.heightW >= 0
    ) {
      this.mustBeDestroyed = true;
      //score += scoreIncrement;
      //scoreIncrement++;
    }
  };

  this.refreshSize = function() {
    this.spriteRenderer.refreshSize();
  };
}

// hitbox prototype(center relative to position)
function hitboxProto(position, cXW, cYW, radiusW) {
  this.position = position;
  this.cXW = cXW;
  this.cYW = cYW;
  this.radiusW = radiusW;

  this.collision = new collisionProto(false, 0, 0, 0, 0);

  // collision test optimized to be runned from softozor
  this.testHit = function(other) {
    var dXW = other.cXW + other.position.xW - (this.cXW + this.position.xW);
    var dYW = other.cYW + other.position.yW - (this.cYW + this.position.yW);
    var dMinW = other.radiusW + this.radiusW;
    var distSqW = dXW * dXW + dYW * dYW;
    var dMinSqW = dMinW * dMinW;
    if (distSqW < dMinSqW) {
      this.collision.type = true;
      this.collision.centerXW = other.cXW;
      this.collision.centerYW = other.cYW;
      this.collision.hitXW = other.cXW + dXW * other.radiusW / dMinW;
      this.collision.hitYW = other.cYW + dYW * other.radiusW / dMinW;
    } else {
      this.collision.type = false;
    }

    return this.collision;
  };

  // Visual reference for hitbox setup. Must be commentar in final game.
  /*
	this.spriteRenderer = new spriteRendererProto(spriteList.hitSpot, this.radiusW * 2, this.radiusW * 2, worldDistanceFactor);
  this.spriteRendererPosition = new positionProto(this.position.xW + this.cXW - this.radiusW, this.position.yW + this.cYW - this.radiusW, worldDistanceFactor);
	this.testUpdate = function(){
    this.spriteRenderer.refreshSize();
    this.spriteRendererPosition.xW = this.position.xW + this.cXW - this.radiusW;
    this.spriteRendererPosition.yW = this.position.yW + this.cYW - this.radiusW;
    this.spriteRenderer.draw(this.spriteRendererPosition.xObsPX(), this.spriteRendererPosition.yObsPX());
	}
*/
}

// collision prototype
function collisionProto(type, centerxW, centeryW, hitXW, hitYW) {
  this.type = type;
  this.centerxW = centerxW;
  this.centeryW = centeryW;
  this.hitXW = hitXW;
  this.hitYW = hitYW;
}

// badbubble
function badBubble(x, y, diameter) {
  var pos = new positionProto(x, y, worldDistanceFactor);
  var radius = diameter / 2;
  var hit = new hitboxProto(pos, radius, radius, radius);
  var obs = new obstacleProto(
    pos,
    diameter,
    diameter,
    spriteList.badBubble,
    hit,
    'bad'
  );
  return obs;
}

// goodbubble
function goodBubble(x, y, diameter) {
  var pos = new positionProto(x, y, worldDistanceFactor);
  var radius = diameter / 2;
  var hit = new hitboxProto(pos, radius, radius, radius);
  var obs = new obstacleProto(
    pos,
    diameter,
    diameter,
    spriteList.goodBubble,
    hit,
    'good'
  );
  return obs;
}

// fill image of bubbles
function fillWorldSquare() {
  while (
    banner.gameState === 'on' &&
    lastFilledSquareXW <
      scrollingPosition.xW + banner.widthPX / worldBandRatioToBanner
  ) {
    for (var fillIndex = 0; fillIndex < badBubblePerSquare; fillIndex++) {
      var x =
        Math.random() * band[worldBandIndex].spriteRenderer.heightW +
        lastFilledSquareXW;
      var y = approachExtrema01(approachExtrema01(Math.random())) * 90 - 5;
      var diameter = 10 + Math.random() * 20;
      obstacle[obstacle.length] = badBubble(x, y, diameter);
      obstacle[obstacle.length - 1].refreshSize();
    }
    for (fillIndex = 0; fillIndex < goodBubblePerSquare; fillIndex++) {
      var x =
        Math.random() * band[worldBandIndex].spriteRenderer.heightW +
        lastFilledSquareXW;
      var y = approachCenter(approachCenter(Math.random())) * 90 - 5;
      var diameter = 10 + Math.random() * 20;
      obstacle[obstacle.length] = goodBubble(x, y, diameter);
      obstacle[obstacle.length - 1].refreshSize();
    }
    lastFilledSquareXW += band[worldBandIndex].spriteRenderer.heightW;
  }
}

// stretches a value between 0 and 1 to 0 or 1, symetric relative to 0.5
function approachExtrema01(number01) {
  return (3 - 2 * number01) * number01 * number01;
}

function approachCenter(number01) {
  return ((2 * number01 - 3) * number01 + 2) * number01;
}

function refreshSize() {
  banner.refreshSize();
  for (var bandIndex = 0; bandIndex < band.length; bandIndex++)
    band[bandIndex].refreshSize();
  softozor.refreshSize();
  for (var obstacleIndex = 0; obstacleIndex < obstacle.length; obstacleIndex++)
    obstacle[obstacleIndex].refreshSize();
  gameStopped.refreshSize();
  playButton.refreshSize();
  restartButton.refreshSize();
  console.log(banner.widthPX);
}

// score display
function scoreUpdate() {
  var xPX = 5;
  var yPX = 5;
  var heightPX = 20;
  var text = 'SCORE : ' + score;

  banner.ctx.font = `bold ${heightPX}px Arial`;
  banner.ctx.fillStyle = 'rgb(255, 255, 255)';
  banner.ctx.fillText(text, xPX, yPX + heightPX);
  banner.ctx.strokeStyle = 'rgb(0, 64, 128)';
  banner.ctx.strokeText(text, xPX, yPX + heightPX);
}

// score increment shown above Softozor
var scorePop = [];

function scorePopProto(pop) {
  this.deltaXPX = softozorData.widthW * worldBandRatioToBanner * 0.6;
  this.deltaYPX = 0;
  this.pop = pop;
  this.lifetime = 30;
  this.mustBeDestroyed = false;

  this.update = function() {
    this.draw();
    this.deltaYPX += 1;
    this.lifetime--;
    this.checkIfDie();
  };

  this.draw = function() {
    var fontSize = '15px';
    banner.ctx.font = `bold ${fontSize} Arial`;
    if (pop > 0) {
      banner.ctx.fillStyle = 'rgba(0, 50, 0, ' + this.lifetime / 30 + ')';
      banner.ctx.fillText(
        '+' + this.pop,
        softozor.position.xObsPX() + this.deltaXPX,
        softozor.position.yObsPX() - this.deltaYPX
      );
    } else {
      banner.ctx.fillStyle = 'rgba(128, 0, 0, ' + this.lifetime / 30 + ')';
      banner.ctx.fillText(
        '' + this.pop,
        softozor.position.xObsPX() + this.deltaXPX,
        softozor.position.yObsPX() - this.deltaYPX
      );
    }
  };

  this.checkIfDie = function() {
    if (this.lifetime <= 0) this.mustBeDestroyed = true;
  };
}

var gameStopped = {
  copyCanvas: undefined,

  heightRatio : 0.6,

  sx: 0,
  sy: 0,
  swidth: 0,
  sheight: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,

  initialize: function() {
    this.copyCanvas = document.createElement('canvas');
  },

  refreshSize: function() {
    this.sx = 0;
    this.sy = 0;
    this.swidth = spriteList.gameStopped.img.naturalWidth;
    this.sheight = spriteList.gameStopped.img.naturalHeight;
    if(this.swidth / this.sheight <= banner.widthPX / (banner.heightPX * this.heightRatio)){
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


    this.copyCanvas.width = this.width;
    this.copyCanvas.height = this.height;
  },

  update: function() {
    if (banner.stateTransition < 1) {
      if (banner.stateTransition > 0) {
        // copy canvas part into a temporary canvas
        var ctxTmp = this.copyCanvas.getContext('2d');
        ctxTmp.globalCompositeOperation = 'source-over';
        ctxTmp.drawImage(
          banner.canvas,
          this.x,
          this.y,
          this.width,
          this.height,
          0,
          0,
          this.width,
          this.height
        );
        ctxTmp.globalCompositeOperation = 'destination-in';
        ctxTmp.drawImage(
          spriteList.gameStopped.img,
          0,
          0,
          this.width,
          this.height
        );
      }

      // make hole in canvas
      banner.ctx.globalCompositeOperation = 'destination-out';
      banner.ctx.drawImage(
        spriteList.gameStopped.img,
        this.sx,
        this.sy,
        this.swidth,
        this.sheight,
        this.x,
        this.y,
        this.width,
        this.height
      );

      if (banner.stateTransition > 0.01) {
        // draw moved part in the hole
        banner.ctx.globalCompositeOperation = 'destination-over';
        banner.ctx.drawImage(
          this.copyCanvas,
          0,
          0,
          Math.floor(this.width),
          Math.floor(this.height * banner.stateTransition),
          this.x,
          this.y + this.height * (1 - banner.stateTransition),
          this.width,
          this.height * banner.stateTransition
        );
      }

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
};

function destroyDeadObjects(array) {
  for (var index = 0; index < array.length; index++) {
    if (array[index].mustBeDestroyed) {
      array.splice(index, 1);
      index--;
    }
  }
}

function graphicUpdate() {
  // world display
  banner.ctx.globalAlpha = 1;
  for (var bandIndex = band.length - 1; bandIndex >= 0; bandIndex--)
    band[bandIndex].update();

  // game objects display
  banner.ctx.globalAlpha =
    1 * banner.stateTransition * banner.gameEndingTransition;
  softozor.graphicUpdate();
  for (var obstacleIndex = 0; obstacleIndex < obstacle.length; obstacleIndex++)
    obstacle[obstacleIndex].update();

  // dashboard display
  banner.ctx.globalAlpha = 0.6 * banner.stateTransition;
  scoreUpdate();
  for (
    var scorePopIndex = 0;
    scorePopIndex < scorePop.length;
    scorePopIndex++
  ) {
    scorePop[scorePopIndex].update();
  }

  // game stopped display
  banner.ctx.globalAlpha = 1;
  gameStopped.update();

  // buttonsdisplay
  playButton.update();
  restartButton.update();
}

// game frame function
function update() {
  banner.transitionUpdate();

  softozor.physicUpdate();

  graphicUpdate();

  // destroy objects
  destroyDeadObjects(obstacle);

  // destroy scorePops
  destroyDeadObjects(scorePop);

  // add objects
  fillWorldSquare();
}

export function initGame() {
  $(window).resize(() => {
    refreshSize();
    update();
  });

  // sprites initialization
  spriteList.initialize();

  // banner initialization
  banner.initialize();

  // bands initialization
  band[5] = new bandProto(spriteList.sky, Infinity);
  band[4] = new bandProto(spriteList.clouds, 16);
  band[3] = new bandProto(spriteList.back, 8);
  band[2] = new bandProto(spriteList.mid, 4);
  band[1] = new bandProto(spriteList.front, 2);
  band[0] = new bandProto(spriteList.world, worldDistanceFactor);

  // Softozor initialization
  softozor.initialize();

  // game stopped display initialization
  gameStopped.initialize();

  // add objects
  fillWorldSquare();
}
