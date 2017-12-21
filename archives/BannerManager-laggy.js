<<<<<<< Updated upstream
import SKY_IMG from '../assets/banner/sky.png'
import CLOUDS_IMG from '../assets/banner/clouds.png'
import BACK_IMG from '../assets/banner/back.png'
import MID_IMG from '../assets/banner/mid.png'
import FRONT_IMG from '../assets/banner/front.png'
import WORLD_BAND_IMG from '../assets/banner/worldBand.png'
import SOFTOZOR_IMG from '../assets/banner/softozor.png'
import GAME_STOPPED_IMG from '../assets/banner/gameStopped.png'
import BUBBLE_IMG from '../assets/banner/bubble.png'


"use strict";

/* The html tag which will contain the banner must:
		- have the attribute:	id="banner"
		- have a proper height
*/

$(document).ready(function () {
  initGame();
});

// game initialization
function initGame(){

	// banner initialization
	banner.html = document.getElementById("banner");
	banner.html.style.position = "relative";
	banner.html.style.overflow = "hidden";
	banner.refreshSize();

	$("#banner").mouseenter(function () {
		run();
	});

	$("#banner").mouseleave(function () {
		stop();
	});

	$("#banner").click(function () {
		softozor.flap();
	});


	$(window).resize(function () {
		refreshSize();
	});

	// display layers initialization
	worldDisplay = document.createElement("div");
	worldDisplay.style.height = "100%";
	worldDisplay.style.width = "100%";
	worldDisplay.style.position = "absolute";
	banner.html.appendChild(worldDisplay);

	gameObjectsDisplay = document.createElement("div");
	gameObjectsDisplay.style.height = "100%";
	gameObjectsDisplay.style.width = "100%";
	gameObjectsDisplay.style.position = "absolute";
	banner.html.appendChild(gameObjectsDisplay);

	dashBoardDisplay = document.createElement("div");
	dashBoardDisplay.style.height = "100%";
	dashBoardDisplay.style.width = "100%";
	dashBoardDisplay.style.position = "absolute";
	banner.html.appendChild(dashBoardDisplay);

	gameStoppedDisplay = document.createElement("div");
	gameStoppedDisplay.style.height = "100%";
	gameStoppedDisplay.style.width = "100%";
	gameStoppedDisplay.style.position = "absolute";
	banner.html.appendChild(gameStoppedDisplay);
	var gameStopped = document.createElement("img");
	gameStopped.setAttribute("src", GAME_STOPPED_IMG);
	gameStopped.style.height = "100%";
	gameStopped.style.margin = "auto";
	gameStopped.style.display = "block";
	gameStoppedDisplay.appendChild(gameStopped);

	gameStoppedDisplay.style.opacity = "1";
	gameObjectsDisplay.style.opacity = "0";
	dashBoardDisplay.style.opacity = "0";

	// bands initialization
	var bandIndex = 0;
	for(bandIndex = 0; bandIndex < bandData.length; bandIndex++){
		band[bandIndex] = new bandProto(bandIndex);
		band[bandIndex].createImages();
	}

	// Softozor initialization
	softozor.initialize();

	// score initialization
	scoreText = document.createElement("p");
	scoreText.style.position = "absolute";
	scoreText.style.left = "5px";
	scoreText.style.bottom = "-5px";
	scoreText.style.color = "white";
	scoreText.style.fontWeight = "bold";
	dashBoardDisplay.appendChild(scoreText);

	// position initialization
	update();
}

// game frame pilot
var runSpeed;
const frameTime = 20;

// game stop-start transition
var transition = 0; // transition reference: 0 = stopped, 1 = started
var transitionDirection = 0; // -1: transition to stop; 0: no transition; 1: transition to start

// bubble amount per image
var bubbleDensity = 40;

// score values
var score = 0;
var scoreIncrement = 1;
var scoreText;

// display layers
var worldDisplay;
var gameObjectsDisplay;
var dashBoardDisplay;
var gameStoppedDisplay;

// banner values
var banner = {
	refreshSize : function(){
		banner.widthPX = parseInt(window.getComputedStyle(banner.html, null).getPropertyValue("width"));
		banner.heightPX = parseInt(window.getComputedStyle(banner.html, null).getPropertyValue("height"));
	}
};

// band values
var band = [];

// bands render data
function bandDataProto(src, alt, widthPX, heightPX, distanceFactor) {
	this.src = src;
	this.alt = alt;
	this.widthPX = widthPX;
	this.heightPX = heightPX;
	this.distanceFactor = distanceFactor;
};
const bandData = [
	new bandDataProto(SKY_IMG, "Sky", 5000, 500, Infinity),
	new bandDataProto(CLOUDS_IMG, "Clouds", 5000, 500, 16),
	new bandDataProto(BACK_IMG, "Back Mountains", 5000, 500, 8),
	new bandDataProto(MID_IMG, "Middle Mountains", 5000, 500, 4),
  new bandDataProto(FRONT_IMG, "Front Mountains", 5000, 500, 2),
  new bandDataProto(WORLD_BAND_IMG, "World Band", 5000, 500, 1)
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
	this.imgRatio = bandData[bandIndex].widthPX / bandData[bandIndex].heightPX;
	this.heightW = 0;
	this.widthW = 0;
	this.heightPX = 0;
	this.widthPX = 0;
	this.img = [];
	this.nImgs = 0;
	this.position;

	this.update = function(){

		if(this.position.xW + this.widthW < softozor.xW){
			this.position.xW += this.widthW;
			if(this.bandIndex === worldBandIndex){
				fillImage(this.nImgs - 1);
			}
		}

		var i = 0;
		for(i = 0; i < this.nImgs; i++){
			this.img[i].update();
		}
	}

	this.createImages = function(){
		// create images to fill banner
		while((this.nImgs - 1) * this.widthPX < banner.widthPX){
			this.img[this.nImgs] = new imgProto(this.bandIndex, this.nImgs);
			if(this.bandIndex === worldBandIndex) fillImage(this.nImgs);
			this.nImgs++;
		}
	}

	var d = bandData[bandIndex].distanceFactor;
	if(d === Infinity || d === 0){
		this.heightPX = banner.heightPX;
		this.heightW = 100 / worldBandRatioToBanner;
	} else {
		this.heightPX = (worldBandRatioToBanner - 1 + d) * banner.heightPX / d;
		this.heightW = (worldBandRatioToBanner - 1 + d) * 100 / worldBandRatioToBanner;
	}

	this.widthPX = this.heightPX * this.imgRatio;
	this.widthW = this.heightW * this.imgRatio;

	this.position = new positionProto(0, 0, bandIndex);
}

// one image in a band
function imgProto(bandIndex, rank){ // the leftmost image has rank 0
	this.bandIndex = bandIndex;
	this.rank = rank;
	this.html;

	this.update = function(){
		this.html.style.left = band[this.bandIndex].position.xObsPX() + this.rank * band[this.bandIndex].widthPX + "px";
		this.html.style.bottom = band[this.bandIndex].position.yObsPX() + "px";
	}

	// image initialization
	this.html = document.createElement("img");
	this.html.setAttribute("src", bandData[this.bandIndex].src);
	this.html.setAttribute("alt", bandData[this.bandIndex].alt);
	this.html.style.position = "absolute";

	this.html.style.width = band[bandIndex].widthPX + "px";
	this.html.style.maxWidth = band[bandIndex].widthPX + "px";
	this.html.style.height = band[bandIndex].heightPX + "px";

	worldDisplay.appendChild(this.html);
}


// Softozor data
const softozorData = {
	src : SOFTOZOR_IMG,
	alt : "Softozor",
	originalDeltaXW : 100, // right shift in *W units
	minYW : 2,
	maxYW : 90,
	heightW : 10,
	originalXSpeed : 0.5,
	gravity : 0.05,
	flapStrength : 1.5,
	hitDownSpeed : 0.1
};

// Softozor
var softozor = {

	xW : 0,
	deltaXW : softozorData.originalDeltaXW,
	deltaXSpeed : 0,
	xSpeed : softozorData.originalXSpeed,
	yW : softozorData.minYW,
	ySpeed : 0,
	flapDelay : 0,
	position : undefined,
	html : undefined,
	hitbox : undefined,

	initialize : function(){

		this.position = new positionProto(this.xW + this.deltaXW, this.yW, worldBandIndex);

		this.html = document.createElement("img");
		this.html.setAttribute("src", softozorData.src);
		this.html.setAttribute("alt", softozorData.alt);
		this.html.style.position = "absolute";
		this.html.style.height = banner.heightPX * worldBandRatioToBanner * softozorData.heightW / 100 + "px";
		gameObjectsDisplay.appendChild(this.html);

		this.updatePosition();

		this.hitbox = new hitboxProto(this.position, softozorData.heightW * 0.6, softozorData.heightW * 0.35, softozorData.heightW * 0.3);
	},

	updatePosition : function(){
		this.position.xW = this.xW + this.deltaXW;
		this.position.yW = this.yW;

		this.html.style.left = this.position.xObsPX() + "px";
		this.html.style.bottom = this.position.yObsPX() + "px";
	},

	update : function(){
		this.fall();
		this.move();
		this.updatePosition();
		this.hitCheck();
		if(this.flapDelay > 0) this.flapDelay -= transition;

		// Visual reference for hitbox setup. Must be commentar in final game.
		// this.hitbox.testUpdate();
	},

	// constant fall
	fall : function (){
		if(this.yW < softozorData.minYW) {
			this.ySpeed = Math.max(this.ySpeed, 0);
		}
		else if(this.yW >= softozorData.minYW && this.yW < softozorData.maxYW){
			this.ySpeed -= softozorData.gravity;
		}
		else {
			this.ySpeed = Math.min(this.ySpeed, -softozorData.hitDownSpeed);
		}
		this.ySpeed = Math.min(Math.max(this.ySpeed, -0.8 ), 3);
		this.yW += this.ySpeed * transition;
	},

	// flap up
	flap : function (){
		if(this.yW < softozorData.maxYW && this.flapDelay <= 0){
			this.ySpeed += softozorData.flapStrength;
			this.flapDelay = 10;
		}
	},

	move : function(){
		this.xW += this.xSpeed * transition;
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
	}
};

/* position convention
	*W : units in % of worldBand height
	*PX: units in pixels
*/
// position prototype
function positionProto(xW, yW, bandIndex){
	this.xW = xW;
	this.yW = yW;
	this.bandIndex = bandIndex;

	this.xObsW = function(){
		var distanceFactor = bandData[this.bandIndex].distanceFactor;
		if(distanceFactor === Infinity || distanceFactor === 0) return xW;
		else return (this.xW - softozor.xW) / distanceFactor;
	}

	this.yObsW = function(){
		var distanceFactor = bandData[this.bandIndex].distanceFactor;
		if(distanceFactor === Infinity || distanceFactor === 0) return yW;
		else return (this.yW - (1 - 1 / worldBandRatioToBanner) * softozor.yW) / distanceFactor;
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
		this.sprite.update();
		this.checkOut();
		// Visual reference for hitbox setup. Must be commentar in final game.
		//this.hitbox.testUpdate();
	}

	this.checkOut = function(){
		if(this.position.xW + this.sprite.widthW <= softozor.xW && softozor.deltaXW + softozorData.heightW >= 0){
			this.mustBeDestroyed = true;
			score += scoreIncrement;
			scoreIncrement++;
		}
	}

	this.destroy = function(){
		gameObjectsDisplay.removeChild(this.sprite.html);
		// Visual reference for hitbox setup. Must be commentar in final game.
		//gameObjectsDisplay.removeChild(this.hitbox.hitBoxSprite.html);
		obstacle.splice(this.obstacleIndex, 1);
	}
}

// sprite prototype
function spriteProto(position, src, alt, widthW, heightW, bandIndex){
	this.position = position;
	this.src = src;
	this.alt = alt;
	this.widthW = widthW;
	this.heightW = heightW;
	this.bandIndex = bandIndex;
	this.html = document.createElement("img");

	this.update = function(){
		this.html.style.left = this.position.xObsPX() + "px";
		this.html.style.bottom = this.position.yObsPX() + "px";
	}

	this.html.setAttribute("src", this.src);
	this.html.setAttribute("alt", this.alt);
	this.html.style.position = "absolute";
	this.html.style.width = widthW / bandData[this.bandIndex].distanceFactor * band[this.bandIndex].heightPX / 100 + "px";
	this.html.style.height = heightW / bandData[this.bandIndex].distanceFactor * band[this.bandIndex].heightPX / 100 + "px";
	gameObjectsDisplay.appendChild(this.html);

	this.update();
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
	var spr = new spriteProto(pos, BUBBLE_IMG, "Soap bubble", diameter, diameter, worldBandIndex);
	var radius = diameter / 2;
	var hit = new hitboxProto(pos, radius, radius, radius);
	var obs = new obstacleProto(pos, spr, hit, obstacleIndex);
	return obs;
}

// fill image of bubbles
function fillImage(imgNumber){
	for(var fillIndex = 0; fillIndex < bubbleDensity; fillIndex++){
		var x = (Math.random() + imgNumber)* band[worldBandIndex].widthW + softozor.xW - softozor.xW % band[worldBandIndex].widthW ;
		var y = approachExtrema01(approachExtrema01(Math.random())) * 90 - 5;
		var diameter = 10 + Math.random() * 20;
		obstacle[obstacle.length] = bubble(x, y, diameter, obstacle.length);
	}
	softozor.xSpeed *= 1.01;
}

// stretches a value between 0 and 1 to 0 or 1, symetric relative to 0.5
function approachExtrema01(number01){
	return (3 - 2 * number01) * number01 * number01;
}

function refreshSize(){
	banner.refreshSize();
	for(var bandIndex = 0; bandIndex < band.length; bandIndex++){
		band[bandIndex].createImages();
		band[bandIndex].update();
	}
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
				transition = Math.max(0, transition - 0.05);
			}
		} else {
			if(transition >= 1){
				transitionDirection = 0;
			} else {
				transition = Math.min(1, transition + 0.05)
			}
		}

		gameStoppedDisplay.style.opacity = (1 - transition).toString();
		gameObjectsDisplay.style.opacity = transition.toString();
		dashBoardDisplay.style.opacity = (transition * 0.8).toString();
	}
}

// stop the game
function stop(){
	clearInterval(runSpeed);
	runSpeed = setInterval(function(){ update(); }, frameTime);
	transitionDirection = -1;
}

function scoreUpdate(){
	scoreText.innerHTML = "SCORE : " + score + " (+" + scoreIncrement + ")";
}

// game frame function
function update(){

	transitionUpdate();

	var bandIndex = 0;
	for(bandIndex = 0; bandIndex < band.length; bandIndex++){
		band[bandIndex].update();
	}

	softozor.update();

	scoreUpdate();

	var obstacleIndex;
	for(obstacleIndex = 0; obstacleIndex < obstacle.length; obstacleIndex++)	obstacle[obstacleIndex].update();

	var destroyedAmount = 0;
	for(obstacleIndex = 0; obstacleIndex < obstacle.length; obstacleIndex++){
		obstacle[obstacleIndex].obstacleIndex -= destroyedAmount;
		if(obstacle[obstacleIndex].mustBeDestroyed){
			obstacle[obstacleIndex].destroy();
			destroyedAmount++;
			obstacleIndex--;
		}
	}
}
=======
import SKY_IMG from '../assets/banner/sky.png'
import CLOUDS_IMG from '../assets/banner/clouds.png'
import BACK_IMG from '../assets/banner/back.png'
import MID_IMG from '../assets/banner/mid.png'
import FRONT_IMG from '../assets/banner/front.png'
import WORLD_BAND_IMG from '../assets/banner/worldBand.png'
import SOFTOZOR_IMG from '../assets/banner/softozor.png'
import GAME_STOPPED_IMG from '../assets/banner/gameStopped.png'
import BUBBLE_IMG from '../assets/banner/bubble.png'


"use strict";

/* The html tag which will contain the banner must:
		- have the attribute:	id="banner"
		- have a proper height
*/

$(document).ready(function () {
  initGame();
});

// game initialization
function initGame(){

	// banner initialization
	banner.html = document.getElementById("banner");
	banner.html.style.position = "relative";
	banner.html.style.overflow = "hidden";
	banner.refreshSize();

	$("#banner").mouseenter(function () {
		run();
	});

	$("#banner").mouseleave(function () {
		stop();
	});

	$("#banner").click(function () {
		softozor.flap();
	});


	$(window).resize(function () {
		refreshSize();
	});

	// display layers initialization
	worldDisplay = document.createElement("div");
	worldDisplay.style.height = "100%";
	worldDisplay.style.width = "100%";
	worldDisplay.style.position = "absolute";
	banner.html.appendChild(worldDisplay);

	gameObjectsDisplay = document.createElement("div");
	gameObjectsDisplay.style.height = "100%";
	gameObjectsDisplay.style.width = "100%";
	gameObjectsDisplay.style.position = "absolute";
	banner.html.appendChild(gameObjectsDisplay);

	dashBoardDisplay = document.createElement("div");
	dashBoardDisplay.style.height = "100%";
	dashBoardDisplay.style.width = "100%";
	dashBoardDisplay.style.position = "absolute";
	banner.html.appendChild(dashBoardDisplay);

	gameStoppedDisplay = document.createElement("div");
	gameStoppedDisplay.style.height = "100%";
	gameStoppedDisplay.style.width = "100%";
	gameStoppedDisplay.style.position = "absolute";
	banner.html.appendChild(gameStoppedDisplay);
	var gameStopped = document.createElement("img");
	gameStopped.setAttribute("src", GAME_STOPPED_IMG);
	gameStopped.style.height = "100%";
	gameStopped.style.margin = "auto";
	gameStopped.style.display = "block";
	gameStoppedDisplay.appendChild(gameStopped);

	gameStoppedDisplay.style.opacity = "1";
	gameObjectsDisplay.style.opacity = "0";
	dashBoardDisplay.style.opacity = "0";

	// bands initialization
	var bandIndex = 0;
	for(bandIndex = 0; bandIndex < bandData.length; bandIndex++){
		band[bandIndex] = new bandProto(bandIndex);
		band[bandIndex].createImages();
	}

	// Softozor initialization
	softozor.initialize();

	// score initialization
	scoreText = document.createElement("p");
	scoreText.style.position = "absolute";
	scoreText.style.left = "5px";
	scoreText.style.bottom = "-5px";
	scoreText.style.color = "white";
	scoreText.style.fontWeight = "bold";
	dashBoardDisplay.appendChild(scoreText);

	// position initialization
	update();
}

// game frame pilot
var runSpeed;
const frameTime = 20;
const speedFactor = 1;

// game stop-start transition
var transition = 0; // transition reference: 0 = stopped, 1 = started
var transitionDirection = 0; // -1: transition to stop; 0: no transition; 1: transition to start

// bubble amount per image
var bubbleDensity = 40;

// score values
var score = 0;
var scoreIncrement = 1;
var scoreText;

// display layers
var worldDisplay;
var gameObjectsDisplay;
var dashBoardDisplay;
var gameStoppedDisplay;

// banner values
var banner = {
	refreshSize : function(){
		banner.widthPX = parseInt(window.getComputedStyle(banner.html, null).getPropertyValue("width"));
		banner.heightPX = parseInt(window.getComputedStyle(banner.html, null).getPropertyValue("height"));
	}
};

// band values
var band = [];

// bands render data
function bandDataProto(src, alt, widthPX, heightPX, distanceFactor) {
	this.src = src;
	this.alt = alt;
	this.widthPX = widthPX;
	this.heightPX = heightPX;
	this.distanceFactor = distanceFactor;
};
const bandData = [
	new bandDataProto(SKY_IMG, "Sky", 5000, 500, Infinity),
	new bandDataProto(CLOUDS_IMG, "Clouds", 5000, 500, 16),
	new bandDataProto(BACK_IMG, "Back Mountains", 5000, 500, 8),
	new bandDataProto(MID_IMG, "Middle Mountains", 5000, 500, 4),
  new bandDataProto(FRONT_IMG, "Front Mountains", 5000, 500, 2),
  new bandDataProto(WORLD_BAND_IMG, "World Band", 5000, 500, 1)
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
	this.imgRatio = bandData[bandIndex].widthPX / bandData[bandIndex].heightPX;
	this.heightW = 0;
	this.widthW = 0;
	this.heightPX = 0;
	this.widthPX = 0;
	this.img = [];
	this.nImgs = 0;
	this.position;

	this.update = function(){

		if(this.position.xW + this.widthW < softozor.xW){
			this.position.xW += this.widthW;
			if(this.bandIndex === worldBandIndex){
				fillImage(this.nImgs - 1);
			}
		}

		var i = 0;
		for(i = 0; i < this.nImgs; i++){
			this.img[i].update();
		}
	}

	this.createImages = function(){
		// create images to fill banner
		while((this.nImgs - 1) * this.widthPX < banner.widthPX){
			this.img[this.nImgs] = new imgProto(this.bandIndex, this.nImgs);
			if(this.bandIndex === worldBandIndex) fillImage(this.nImgs);
			this.nImgs++;
		}
	}

	var d = bandData[bandIndex].distanceFactor;
	if(d === Infinity || d === 0){
		this.heightPX = banner.heightPX;
		this.heightW = 100 / worldBandRatioToBanner;
	} else {
		this.heightPX = (worldBandRatioToBanner - 1 + d) * banner.heightPX / d;
		this.heightW = (worldBandRatioToBanner - 1 + d) * 100 / worldBandRatioToBanner;
	}

	this.widthPX = this.heightPX * this.imgRatio;
	this.widthW = this.heightW * this.imgRatio;

	this.position = new positionProto(0, 0, bandIndex);
}

// one image in a band
function imgProto(bandIndex, rank){ // the leftmost image has rank 0
	this.bandIndex = bandIndex;
	this.rank = rank;
	this.html;

	this.update = function(){
		this.html.style.left = band[this.bandIndex].position.xObsPX() + this.rank * band[this.bandIndex].widthPX + "px";
		this.html.style.bottom = band[this.bandIndex].position.yObsPX() + "px";
	}

	// image initialization
	this.html = document.createElement("img");
	this.html.setAttribute("src", bandData[this.bandIndex].src);
	this.html.setAttribute("alt", bandData[this.bandIndex].alt);
	this.html.style.position = "absolute";

	this.html.style.width = band[bandIndex].widthPX + "px";
	this.html.style.maxWidth = band[bandIndex].widthPX + "px";
	this.html.style.height = band[bandIndex].heightPX + "px";

	worldDisplay.appendChild(this.html);
}


// Softozor data
const softozorData = {
	src : SOFTOZOR_IMG,
	alt : "Softozor",
	originalDeltaXW : 30, // right shift in *W units
	minYW : 2,
	maxYW : 90,
	heightW : 10,
	originalXSpeed : 0.5 * speedFactor,
	gravity : 0.05,
	flapStrength : 1.5,
	hitDownSpeed : 0.1 * speedFactor
};

// Softozor
var softozor = {

	xW : 0,
	deltaXW : softozorData.originalDeltaXW,
	deltaXSpeed : 0,
	xSpeed : softozorData.originalXSpeed,
	yW : softozorData.minYW,
	ySpeed : 0,
	flapDelay : 0,
	position : undefined,
	html : undefined,
	hitbox : undefined,

	initialize : function(){

		this.position = new positionProto(this.xW + this.deltaXW, this.yW, worldBandIndex);

		this.html = document.createElement("img");
		this.html.setAttribute("src", softozorData.src);
		this.html.setAttribute("alt", softozorData.alt);
		this.html.style.position = "absolute";
		this.html.style.height = banner.heightPX * worldBandRatioToBanner * softozorData.heightW / 100 + "px";
		gameObjectsDisplay.appendChild(this.html);

		this.updatePosition();

		this.hitbox = new hitboxProto(this.position, softozorData.heightW * 0.6, softozorData.heightW * 0.35, softozorData.heightW * 0.3);
	},

	updatePosition : function(){
		this.position.xW = this.xW + this.deltaXW;
		this.position.yW = this.yW;

		this.html.style.left = this.position.xObsPX() + "px";
		this.html.style.bottom = this.position.yObsPX() + "px";
	},

	update : function(){
		this.fall();
		this.move();
		this.updatePosition();
		this.hitCheck();
		if(this.flapDelay > 0) this.flapDelay -= transition * speedFactor;

		// Visual reference for hitbox setup. Must be commentar in final game.
		// this.hitbox.testUpdate();
	},

	// constant fall
	fall : function (){
		if(this.yW < softozorData.minYW) {
			this.ySpeed = Math.max(this.ySpeed, 0);
		}
		else if(this.yW >= softozorData.minYW && this.yW < softozorData.maxYW){
			this.ySpeed -= softozorData.gravity;
		}
		else {
			this.ySpeed = Math.min(this.ySpeed, -softozorData.hitDownSpeed);
		}
		this.ySpeed = Math.min(Math.max(this.ySpeed, -0.8 * speedFactor ), 3 * speedFactor);
		this.yW += this.ySpeed * transition;
	},

	// flap up
	flap : function (){
		if(this.yW < softozorData.maxYW && this.flapDelay <= 0){
			this.ySpeed += softozorData.flapStrength;
			this.flapDelay = 10;
		}
	},

	move : function(){
		this.xW += this.xSpeed * transition;
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
	}
};

/* position convention
	*W : units in % of worldBand height
	*PX: units in pixels
*/
// position prototype
function positionProto(xW, yW, bandIndex){
	this.xW = xW;
	this.yW = yW;
	this.bandIndex = bandIndex;

	this.xObsW = function(){
		var distanceFactor = bandData[this.bandIndex].distanceFactor;
		if(distanceFactor === Infinity || distanceFactor === 0) return xW;
		else return (this.xW - softozor.xW) / distanceFactor;
	}

	this.yObsW = function(){
		var distanceFactor = bandData[this.bandIndex].distanceFactor;
		if(distanceFactor === Infinity || distanceFactor === 0) return yW;
		else return (this.yW - (1 - 1 / worldBandRatioToBanner) * softozor.yW) / distanceFactor;
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
		this.sprite.update();
		this.checkOut();
		// Visual reference for hitbox setup. Must be commentar in final game.
		//this.hitbox.testUpdate();
	}

	this.checkOut = function(){
		if(this.position.xW + this.sprite.widthW <= softozor.xW && softozor.deltaXW + softozorData.heightW >= 0){
			this.mustBeDestroyed = true;
			score += scoreIncrement;
			scoreIncrement++;
		}
	}

	this.destroy = function(){
		gameObjectsDisplay.removeChild(this.sprite.html);
		// Visual reference for hitbox setup. Must be commentar in final game.
		//gameObjectsDisplay.removeChild(this.hitbox.hitBoxSprite.html);
		obstacle.splice(this.obstacleIndex, 1);
	}
}

// sprite prototype
function spriteProto(position, src, alt, widthW, heightW, bandIndex){
	this.position = position;
	this.src = src;
	this.alt = alt;
	this.widthW = widthW;
	this.heightW = heightW;
	this.bandIndex = bandIndex;
	this.html = document.createElement("img");

	this.update = function(){
		this.html.style.left = this.position.xObsPX() + "px";
		this.html.style.bottom = this.position.yObsPX() + "px";
	}

	this.html.setAttribute("src", this.src);
	this.html.setAttribute("alt", this.alt);
	this.html.style.position = "absolute";
	this.html.style.width = widthW / bandData[this.bandIndex].distanceFactor * band[this.bandIndex].heightPX / 100 + "px";
	this.html.style.height = heightW / bandData[this.bandIndex].distanceFactor * band[this.bandIndex].heightPX / 100 + "px";
	gameObjectsDisplay.appendChild(this.html);

	this.update();
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
	var spr = new spriteProto(pos, BUBBLE_IMG, "Soap bubble", diameter, diameter, worldBandIndex);
	var radius = diameter / 2;
	var hit = new hitboxProto(pos, radius, radius, radius);
	var obs = new obstacleProto(pos, spr, hit, obstacleIndex);
	return obs;
}

// fill image of bubbles
function fillImage(imgNumber){
	for(var fillIndex = 0; fillIndex < bubbleDensity; fillIndex++){
		var x = (Math.random() + imgNumber)* band[worldBandIndex].widthW + softozor.xW - softozor.xW % band[worldBandIndex].widthW ;
		var y = approachExtrema01(approachExtrema01(Math.random())) * 90 - 5;
		var diameter = 10 + Math.random() * 20;
		obstacle[obstacle.length] = bubble(x, y, diameter, obstacle.length);
	}
	softozor.xSpeed *= 1.01;
}

// stretches a value between 0 and 1 to 0 or 1, symetric relative to 0.5
function approachExtrema01(number01){
	return (3 - 2 * number01) * number01 * number01;
}

function refreshSize(){
	banner.refreshSize();
	for(var bandIndex = 0; bandIndex < band.length; bandIndex++){
		band[bandIndex].createImages();
		band[bandIndex].update();
	}
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
				transition = Math.max(0, transition - 0.05 * speedFactor);
			}
		} else {
			if(transition >= 1){
				transitionDirection = 0;
			} else {
				transition = Math.min(1, transition + 0.05 * speedFactor)
			}
		}

		gameStoppedDisplay.style.opacity = (1 - transition).toString();
		gameObjectsDisplay.style.opacity = transition.toString();
		dashBoardDisplay.style.opacity = (transition * 0.8).toString();
	}
}

// stop the game
function stop(){
	clearInterval(runSpeed);
	runSpeed = setInterval(function(){ update(); }, frameTime);
	transitionDirection = -1;
}

function scoreUpdate(){
	scoreText.innerHTML = "SCORE : " + score + " (+" + scoreIncrement + ")";
}

// game frame function
function update(){

	transitionUpdate();

	var bandIndex = 0;
	for(bandIndex = 0; bandIndex < band.length; bandIndex++){
		band[bandIndex].update();
	}

	softozor.update();

	scoreUpdate();

	var obstacleIndex;
	for(obstacleIndex = 0; obstacleIndex < obstacle.length; obstacleIndex++)	obstacle[obstacleIndex].update();

	var destroyedAmount = 0;
	for(obstacleIndex = 0; obstacleIndex < obstacle.length; obstacleIndex++){
		obstacle[obstacleIndex].obstacleIndex -= destroyedAmount;
		if(obstacle[obstacleIndex].mustBeDestroyed){
			obstacle[obstacleIndex].destroy();
			destroyedAmount++;
			obstacleIndex--;
		}
	}
}
>>>>>>> Stashed changes
