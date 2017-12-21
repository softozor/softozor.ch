var SKY_IMG = '../assets/banner/sky.png';
var CLOUDS_IMG = '../assets/banner/clouds.png';
var BACK_IMG = '../assets/banner/back.png';
var MID_IMG = '../assets/banner/mid.png';
var FRONT_IMG = '../assets/banner/front.png';
var WORLD_BAND_IMG = '../assets/banner/worldBand.png';
var SOFTOZOR_IMG = '../assets/banner/softozor.png';
var SOFTOZOR_FLAP1_IMG = '../assets/banner/softozor_flap1.png';
var SOFTOZOR_FLAP2_IMG = '../assets/banner/softozor_flap2.png';
var GAME_STOPPED_IMG = '../assets/banner/gameStopped.png';
var GAME_STOPPED_SHADOW_IMG = '../assets/banner/gameStopped_shadow.png';
var GAME_STOPPED_BACKGROUND_IMG = '../assets/banner/gameStopped_background.png';
var BUBBLE_IMG = '../assets/banner/bubble.png';

"use strict";

// image that remembers if the source is loaded or not
function spriteProto(src, widthW, heightW, bandIndex){

  this.img = new Image();
  this.widthW = widthW;
  this.heightW = heightW;
  this.bandIndex = bandIndex;

  this.img.src = src;

  this.draw = function(x0PX, y0PX){

    var sx, sy, swidth, sheight, x, y, width, height;

    var mustBeDrawn = true;
    var scrollXPX = scrollingPosition.xObsPX();
    var scrollYPX = scrollingPosition.yObsPX();

    if(x0PX <= -this.widthPX){
      mustBeDrawn = false;
    } else if(x0PX <= 0){
      x = 0;
      width = Math.min(banner.widthPX, this.widthPX + x0PX);
      sx = -x0PX * this.PXToN;
      swidth = width * this.PXToN;
    } else if(x0PX <= scrollXPX + banner.widthPX - this.widthPX) {
      x = x0PX;
      width = Math.min(banner.widthPX - x0PX, this.widthPX);
      sx = 0;
      swidth = width * this.PXToN;
    } else if(x0PX < scrollXPX + banner.widthPX ){
      x = x0PX;
      width = banner.widthPX - x0PX;
      sx = 0;
      swidth = width * this.PXToN;
    } else {
      mustBeDrawn = false;
    }

    if(y0PX <= -this.heightPX){
      mustBeDrawn = false;
    } else if(y0PX <= 0){
      y = 0;
      height = Math.min(banner.heightPX, this.heightPX + y0PX);
      sy = -y0PX * this.PXToN;
      sheight = height * this.PXToN;
    } else if(y0PX <= scrollYPX + banner.heightPX - this.heightPX) {
      y = y0PX;
      height = Math.min(banner.heightPX - y0PX, this.heightPX);
      sy = 0;
      sheight = height * this.PXToN;
    } else if(y0PX < scrollYPX + banner.heightPX ){
      y = y0PX;
      height = banner.heightPX - y0PX;
      sy = 0;
      sheight = height * this.PXToN;
    } else {
      mustBeDrawn = false;
    }

    if(mustBeDrawn){
      banner.ctx.drawImage(this.img, sx, sy, swidth, sheight, x, y, width, height);
    }
  }

  this.refreshSize = function(){
    var d = bandData[this.bandIndex].distanceFactor;
    if(d === 0 || d === Infinity){
      this.heightPX = this.heightW;
      this.widthPX = this.widthW;
    } else {
      this.heightPX = this.heightW * worldBandRatioToBanner * banner.heightPX / 100 / d;
      this.widthPX = this.widthW * worldBandRatioToBanner * banner.heightPX / 100 / d;
    }
    this.PXToN = this.img.naturalHeight / this.heightPX;
  }
}

/* The html tag which will contain the banner must:
		- have the attribute:	id="banner"
		- have a proper height
*/


// game frame pilot
var runSpeed;
const frameTime = 20;

// game stop-start transition
var transition = 0; // transition reference: 0 = stopped, 1 = started
var transitionDirection = 0; // -1: transition to stop; 0: no transition; 1: transition to start

// bubble values
var bubblePerSquare = 4;
var lastFilledSquareXW = 200;

// score values
var score = 0;
var scoreIncrement = 1;
var scoreText;

// banner values
var banner = {
  initialize : function(){
	   this.html = document.getElementById("banner");
     this.canvas = document.createElement("canvas");
     this.html.appendChild(this.canvas);
     this.ctx = this.canvas.getContext("2d");

     this.canvas.setAttribute("onmouseenter", "run()");
     this.canvas.setAttribute("onmouseleave", "stop()");
     this.canvas.setAttribute("onmousedown", "softozor.startFlap()");
     this.canvas.setAttribute("onmouseup", "softozor.stopFlap()");
  },

	refreshSize : function(){
		this.widthPX = parseInt(window.getComputedStyle(this.html, null).getPropertyValue("width"));
		this.heightPX = parseInt(window.getComputedStyle(this.html, null).getPropertyValue("height"));
    this.canvas.width = this.widthPX;
    this.canvas.height = this.heightPX;
	}
};

// band values
var band = [];

// bands render data
function bandDataProto(src, alt, distanceFactor) {
	this.src = src;
	this.alt = alt;
	this.distanceFactor = distanceFactor;
};
const bandData = [
	new bandDataProto(SKY_IMG, "Sky", Infinity),
	new bandDataProto(CLOUDS_IMG, "Clouds", 16),
	new bandDataProto(BACK_IMG, "Back Mountains", 8),
	new bandDataProto(MID_IMG, "Middle Mountains", 4),
  new bandDataProto(FRONT_IMG, "Front Mountains", 2),
  new bandDataProto(WORLD_BAND_IMG, "World Band", 1)
	/*
	You can add or remove bands here.
	The last one will be in front of the others.
	You must specify width and height for image ratio calculation
	The world band should have a distanceFactor of 1 to be congruent to coordinate system.
	*/
];
const worldBandIndex = 5;
const worldBandRatioToBanner = 2;

// prototype of one layer of the banner
function bandProto(bandIndex){
	this.bandIndex = bandIndex;
  this.sprite = new spriteProto(bandData[bandIndex].src, 1000, 100, bandIndex);
  this.position = new positionProto(0, 0, bandIndex);

	this.update = function(){
    if(this.position.xW + this.widthW < scrollingPosition.xW) this.position.xW += this.widthW;

    var x0PX = this.position.xObsPX();
    var y0PX = this.position.yObsPX();
    while(x0PX <= banner.widthPX){
      this.sprite.draw(x0PX, y0PX);
      x0PX += this.sprite.widthPX;
    }
  }

  this.refreshSize = function(){
    var d = bandData[bandIndex].distanceFactor;
    if(d === Infinity || d === 0){
      this.sprite.heightW = banner.heightPX;
    } else {
      this.sprite.heightW = (worldBandRatioToBanner - 1 + d) * 100 / worldBandRatioToBanner;
    }
    this.sprite.widthW = this.sprite.heightW * this.sprite.img.naturalWidth / this.sprite.img.naturalHeight;
    this.sprite.refreshSize();
  }
}

// Softozor data
const softozorData = {
	alt : "Softozor",
	originalDeltaXW : 100, // right shift in *W units
	heightW : 10,
	minYW : 0,
	maxYW : 100,
	originalXSpeed : 0.5,
	gravity : 0.05,
	flapStrength : 0.9,
  flapDelay : 12,
	hitDownSpeed : 0.1,
  minSpeed : -1.2,
  maxSpeed : 0.8
};

// Softozor
var softozor = {

	position : undefined,
	deltaXW : softozorData.originalDeltaXW,
	deltaXSpeed : 0,
	xSpeed : softozorData.originalXSpeed,
	ySpeed : 0,
	flapWait : 0,
	spriteIdle : undefined,
  spriteFlap1 : undefined,
  spriteFlap2 : undefined,
	hitbox : undefined,
  doFlap : false,

	initialize : function(){

    scrollingPosition = new positionProto(0, (worldBandRatioToBanner - 1) * softozorData.maxYW / worldBandRatioToBanner, worldBandIndex);
		this.position = new positionProto(scrollingPosition.xW + this.deltaXW, softozorData.maxYW - softozorData.heightW * worldBandRatioToBanner, worldBandIndex);

		this.spriteIdle = new spriteProto(SOFTOZOR_IMG, softozorData.heightW, softozorData.heightW, worldBandIndex);
    this.spriteFlap1 = new spriteProto(SOFTOZOR_FLAP1_IMG, softozorData.heightW, softozorData.heightW, worldBandIndex);
    this.spriteFlap2 = new spriteProto(SOFTOZOR_FLAP2_IMG, softozorData.heightW, softozorData.heightW, worldBandIndex);

		this.updatePosition();

		this.hitbox = new hitboxProto(this.position, softozorData.heightW * 0.6, softozorData.heightW * 0.35, softozorData.heightW * 0.3);
	},

	updatePosition : function(){
		this.position.xW = scrollingPosition.xW + this.deltaXW;
		scrollingPosition.yW = (worldBandRatioToBanner - 1) * this.position.yW / worldBandRatioToBanner;
	},

	update : function(){
		this.fall();
		this.moveForward();
    this.flap();
		this.updatePosition();
		this.hitCheck();
		if(this.flapWait > 0) this.flapWait -= transition;

    if(this.flapWait >= softozorData.flapDelay - 3){
      this.spriteFlap1.draw(this.position.xObsPX(), this.position.yObsPX());
    } else if(this.flapWait >= softozorData.flapDelay - 6){
      this.spriteFlap2.draw(this.position.xObsPX(), this.position.yObsPX());
    } else {
      this.spriteIdle.draw(this.position.xObsPX(), this.position.yObsPX());
    }

		// Visual reference for hitbox setup. Must be commentar in final game.
		// this.hitbox.testUpdate();
	},

	// constant fall
	fall : function (){
		if(this.position.yW > softozorData.maxYW - softozorData.heightW * worldBandRatioToBanner) {
			this.ySpeed = Math.min(this.ySpeed, 0);
		}	else if(this.position.yW > softozorData.minYW){
        this.ySpeed += softozorData.gravity;
		} else {
			this.ySpeed = Math.max(this.ySpeed, softozorData.hitDownSpeed);
      this.ySpeed += softozorData.gravity;
    }
		this.ySpeed = Math.min(Math.max(this.ySpeed, softozorData.minSpeed ), softozorData.maxSpeed);
		this.position.yW += this.ySpeed * transition;
	},

	// flap up
	flap : function (){
		if(this.doFlap && this.position.yW > softozorData.minYW && this.flapWait <= 0){
			this.ySpeed -= softozorData.flapStrength;
			this.flapWait = softozorData.flapDelay;
		}
	},

  startFlap : function (){
    this.doFlap = true;
  },

  stopFlap : function (){
    this.doFlap = false;
  },

	moveForward : function(){
		scrollingPosition.xW += this.xSpeed * transition;
		this.deltaXW += this.deltaXSpeed * transition;
		this.deltaXSpeed *= 0.9;
	},

	// hit check
	hitCheck : function(){
		var length = obstacle.length;
		for(var obstacleIndex = 0; obstacleIndex < length; obstacleIndex++){
			var collision = this.hitbox.testHit(obstacle[obstacleIndex].hitbox);
			if(collision.type === true){
				var dx = collision.hitXW - collision.centerXW;
				var dy = collision.hitYW - collision.centerYW;
				var speedChangeFactor = 2 * ((this.deltaXSpeed + this.xSpeed) * dx + this.ySpeed * dy) / (dx * dx + dy * dy);
				this.deltaXSpeed -= dx * speedChangeFactor;
				this.ySpeed -= dy * speedChangeFactor;
				obstacle[obstacleIndex].mustBeDestroyed = true;
				scoreIncrement = 1;
			}
		}
	},

  refreshSize : function(){
    this.spriteIdle.widthW = this.spriteIdle.heightW * this.spriteIdle.img.naturalWidth / this.spriteIdle.img.naturalHeight;
    this.spriteIdle.refreshSize();

    this.spriteFlap1.widthW = this.spriteFlap1.heightW * this.spriteFlap1.img.naturalWidth / this.spriteFlap1.img.naturalHeight;
    this.spriteFlap1.refreshSize();

    this.spriteFlap2.widthW = this.spriteFlap2.heightW * this.spriteFlap2.img.naturalWidth / this.spriteFlap2.img.naturalHeight;
    this.spriteFlap2.refreshSize();
  }
};

var scrollingPosition = new positionProto(0, (worldBandRatioToBanner - 1) * softozorData.maxYW / worldBandRatioToBanner, worldBandIndex);

/* position convention
	*W : units in % of worldBand height
	*PX: units in banner pixels
  *N: units in source pixels
*/
// position prototype
function positionProto(xW, yW, bandIndex){
	this.xW = xW;
	this.yW = yW;
	this.bandIndex = bandIndex;

	this.xObsW = function(){
		var distanceFactor = bandData[this.bandIndex].distanceFactor;
		if(distanceFactor === Infinity || distanceFactor === 0) return xW;
		else return (this.xW - scrollingPosition.xW) / distanceFactor;
	}

	this.yObsW = function(){
		var distanceFactor = bandData[this.bandIndex].distanceFactor;
		if(distanceFactor === Infinity || distanceFactor === 0) return yW;
		else return (this.yW - scrollingPosition.yW) / distanceFactor;
	}

	function obsToPX(obs){return obs * banner.heightPX * worldBandRatioToBanner / 100;}

	this.xObsPX = function(){return obsToPX(this.xObsW(this.xW));}

	this.yObsPX = function(){return obsToPX(this.yObsW(this.yW));}
}


// obstacle
var obstacle = [];


function obstacleProto(position, sprite, hitbox, obstacleIndex){
	this.position = position;
	this.sprite = sprite;
	this.hitbox = hitbox;
	this.obstacleIndex = obstacleIndex;
	this.mustBeDestroyed = false;

	this.update = function(){
		this.sprite.draw(this.position.xObsPX(), this.position.yObsPX());
		this.checkOut();
		// Visual reference for hitbox setup. Must be commentar in final game.
		//this.hitbox.testUpdate();
	}

	this.checkOut = function(){
		if(this.position.xW + this.sprite.widthW <= scrollingPosition.xW && softozor.deltaXW + softozorData.heightW >= 0){
			this.mustBeDestroyed = true;
			score += scoreIncrement;
			scoreIncrement++;
		}
	}

	this.destroy = function(){
		// Visual reference for hitbox setup. Must be commentar in final game.
		//gameObjectsDisplay.removeChild(this.hitbox.hitBoxSprite.html);
		obstacle.splice(this.obstacleIndex, 1);
	}

  this.refreshSize = function(){
    this.sprite.refreshSize();
  }
}

// hitbox prototype(center relative to position)
function hitboxProto(position, cXW, cYW, radiusW){
	this.position = position;
	this.cXW = cXW;
	this.cYW = cYW;
	this.radiusW = radiusW;

	this.collision = new collisionProto(false, 0, 0, 0, 0);

	// collision test optimized to be runned from softozor
	this.testHit = function(other){
		var dXW = (other.cXW + other.position.xW) - (this.cXW + this.position.xW);
		var dYW = (other.cYW + other.position.yW) - (this.cYW + this.position.yW);
		var dMinW = other.radiusW + this.radiusW;
		var distSqW = dXW * dXW + dYW * dYW;
		var dMinSqW = dMinW * dMinW;
		if(distSqW < dMinSqW){
			this.collision.type = true;
			this.collision.centerXW = other.cXW;
			this.collision.centerYW = other.cYW;
			this.collision.hitXW = other.cXW + dXW * other.radiusW / dMinW;
			this.collision.hitYW = other.cYW + dYW * other.radiusW / dMinW;
		} else {
			this.collision.type = false;
		}

		return this.collision;
	}

	// Visual reference for hitbox setup. Must be commentar in final game.
	/*
	this.spritePosition = new positionProto(position.xW + cXW - radiusW, position.yW + cYW - radiusW, position.bandIndex);
	this.hitBoxSprite = new spriteProto(this.spritePosition, "filePath + redCircle.png", "Hitbox sprite reference", this.radiusW * 2, this.radiusW * 2, position.bandIndex);
	this.hitBoxSprite.html.style.opacity = "0.3";
	this.testUpdate = function(){
		this.spritePosition.xW = this.position.xW + cXW - radiusW;
		this.spritePosition.yW = this.position.yW + cYW - radiusW;
		this.hitBoxSprite.update();
	}
	*/
}

// collision prototype
function collisionProto(type, centerxW, centeryW, hitXW, hitYW){
	this.type = type;
	this.centerxW = centerxW;
	this.centeryW = centeryW;
	this.hitXW = hitXW;
	this.hitYW = hitYW;
}

// bubble
function bubble(x, y, diameter, obstacleIndex){
	var pos = new positionProto(x, y, worldBandIndex);
	var spr = new spriteProto(BUBBLE_IMG, diameter, diameter, worldBandIndex);
	var radius = diameter / 2;
	var hit = new hitboxProto(pos, radius, radius, radius);
	var obs = new obstacleProto(pos, spr, hit, obstacleIndex);
	return obs;
}

// fill image of bubbles
function fillWorldSquare(){
  while(lastFilledSquareXW < scrollingPosition.xW + banner.widthPX / worldBandRatioToBanner) {
  	for(var fillIndex = 0; fillIndex < bubblePerSquare; fillIndex++) {
  		var x = Math.random() * band[worldBandIndex].sprite.heightW + lastFilledSquareXW;
  		var y = approachExtrema01(approachExtrema01(Math.random())) * 90 - 5;
  		var diameter = 10 + Math.random() * 20;
  		obstacle[obstacle.length] = bubble(x, y, diameter, obstacle.length);
      obstacle[obstacle.length - 1].refreshSize();
  	}
  	softozor.xSpeed *= 1.01;
    lastFilledSquareXW += band[worldBandIndex].sprite.heightW;
  }
}

// stretches a value between 0 and 1 to 0 or 1, symetric relative to 0.5
function approachExtrema01(number01){
	return (3 - 2 * number01) * number01 * number01;
}

function refreshSize(){
	banner.refreshSize();
	for(var bandIndex = 0; bandIndex < band.length; bandIndex++) band[bandIndex].refreshSize();
  softozor.refreshSize();
	for(var obstacleIndex = 0; obstacleIndex < obstacle.length; obstacleIndex++) obstacle[obstacleIndex].refreshSize();
  gameStopped.refreshSize();
}

// run the game
function run(){
	clearInterval(runSpeed);
	runSpeed = setInterval(function(){ update(); }, frameTime);
	transitionDirection = 1;
}

// transition between game started and game stopped
function transitionUpdate(){

	if(transitionDirection != 0){
		if(transitionDirection === -1){
			if(transition <= 0){
				transitionDirection = 0;
				clearInterval(runSpeed);
			} else {
				transition = Math.max(0, transition - 0.03);
			}
		} else {
			if(transition >= 1){
				transitionDirection = 0;
			} else {
				transition = Math.min(1, transition + 0.03)
			}
		}
	}
}

// stop the game
function stop(){
	clearInterval(runSpeed);
	runSpeed = setInterval(function(){ update(); }, frameTime);
	transitionDirection = -1;
}

function scoreUpdate(){
  banner.ctx.font = "bold 15px Arial";
  banner.ctx.fillStyle = "#FFFFFF";
  banner.ctx.fillText("SCORE : " + score + " (+" + scoreIncrement + ")", 5, banner.heightPX - 5);
}

var gameStopped = {
  img : undefined,
  shadow: undefined,
  background: undefined,
  copyCanvas: undefined,

  sx : 0,
  sy : 0,
  swidth : 0,
  sheight : 0,
  x : 0,
  y : 0,
  width : 0,
  height : 0,

  initialize : function(){
    this.img = new Image();
    this.img.src = GAME_STOPPED_IMG;

    this.shadow = new Image();
    this.shadow.src = GAME_STOPPED_SHADOW_IMG;

    this.background = new Image();
    this.background.src = GAME_STOPPED_BACKGROUND_IMG;

    this.copyCanvas = document.createElement("canvas");
  },

  refreshSize : function(){
      this.sx = 0;
      this.sy = 0;
      this.swidth = this.img.naturalWidth;
      this.sheight = this.img.naturalHeight;
      this.y = banner.heightPX * 0.2;
      this.height = banner.heightPX * 0.6;
      this.width = this.height * this.swidth / this.sheight;
      this.x = (banner.widthPX - this.width) / 2;

      this.copyCanvas.width = this.width;
      this.copyCanvas.height = this.height;
  },

  draw : function(){
    if(transition < 1){

      if(transition > 0){
        // copy canvas part into a temporary canvas
        var ctxTmp = this.copyCanvas.getContext("2d");
        ctxTmp.globalCompositeOperation = "source-over";
        ctxTmp.drawImage(banner.canvas, this.x, this.y, this.width, this.height, 0, 0, this.width, this.height);
        ctxTmp.globalCompositeOperation = "destination-in";
        ctxTmp.drawImage(this.img, 0, 0, this.width, this.height);
      }

      // make hole in canvas
      banner.ctx.globalCompositeOperation = "destination-out";
      banner.ctx.drawImage(this.img, this.sx, this.sy, this.swidth, this.sheight, this.x, this.y, this.width, this.height);

      if(transition > 0){
        // draw moved part in the hole
        banner.ctx.globalCompositeOperation = "destination-over";
        banner.ctx.drawImage(this.copyCanvas, 0, 0, this.width, this.height * transition, this.x, this.y + this.height * (1 - transition), this.width, this.height * transition);
      }

      // draw background
      banner.ctx.globalCompositeOperation = "destination-over";
      banner.ctx.drawImage(this.background, this.x, this.y, this.width, this.height);

      // draw shadow
      banner.ctx.globalCompositeOperation = "source-over";
      banner.ctx.drawImage(this.shadow, this.sx, this.sy, this.swidth, this.sheight, this.x, this.y, this.width, this.height);
    }
  }
}

// game frame function
function update(){

	transitionUpdate();

  // world display
  banner.ctx.globalAlpha = 1;
	for(var bandIndex = 0; bandIndex < band.length; bandIndex++) band[bandIndex].update();

  // game objects display
  banner.ctx.globalAlpha = 1 * transition;
	softozor.update();
	for(var obstacleIndex = 0; obstacleIndex < obstacle.length; obstacleIndex++)	obstacle[obstacleIndex].update();

	// dashboard display
  banner.ctx.globalAlpha = 0.6 * transition;
  scoreUpdate();

  // game stopped display
  banner.ctx.globalAlpha = 1;
  gameStopped.draw();

  // destroy objects
  var destroyedAmount = 0;
	for(obstacleIndex = 0; obstacleIndex < obstacle.length; obstacleIndex++){
		obstacle[obstacleIndex].obstacleIndex -= destroyedAmount;
		if(obstacle[obstacleIndex].mustBeDestroyed){
			obstacle[obstacleIndex].destroy();
			destroyedAmount++;
			obstacleIndex--;
		}
	}

  // add objects
  fillWorldSquare();
}

// game initialization
(function () {

  document.body.setAttribute("onresize", "refreshSize(); update()");
  document.body.setAttribute("onload", "refreshSize(); update()");

	// banner initialization
	banner.initialize();

	// bands initialization
	var bandIndex = 0;
	for(bandIndex = 0; bandIndex < bandData.length; bandIndex++){
		band[bandIndex] = new bandProto(bandIndex);
	}

	// Softozor initialization
	softozor.initialize();

  // game stopped display initialization
  gameStopped.initialize();
}());
