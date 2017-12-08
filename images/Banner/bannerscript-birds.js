"use strict";

/* The html tag which will contain the banner must:  
		- have the attribute:	id="banner"
		- be followed by:		<script src="bannerscript.js"></script>
		- have a proper height
*/

// game frame pilot
var runSpeed;

// game stop-start transition
var transition = 0; // transition reference: 0 = stopped, 1 = started
var transitionDirection = 0; // -1: transition to stop; 0: no transition; 1: transition to start

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
var banner = {};

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
	new bandDataProto("sky.png", "Sky", 5000, 500, Infinity),
	new bandDataProto("clouds.png", "Clouds", 5000, 500, 16),
	new bandDataProto("back.png", "Back Mountains", 5000, 500, 8),
	new bandDataProto("mid.png", "Middle Mountains", 5000, 500, 4),
	new bandDataProto("front.png", "Front Mountains", 5000, 500, 2),
	new bandDataProto("worldBand.png", "World Band", 5000, 500, 1)
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
		
		if(this.position.xW + this.widthW < softozor.xW) this.position.xW += this.widthW;
		
		var i = 0;
		for(i = 0; i < this.nImgs; i++){
			this.img[i].update();
		}
	}
	
	this.createImages = function(){
		// create images to fill banner
		while((this.nImgs - 1) * this.widthPX < banner.widthPX){
			this.img[this.nImgs] = new imgProto(this.bandIndex, this.nImgs);
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
	this.html.style.height = band[bandIndex].heightPX + "px";
	
	worldDisplay.appendChild(this.html);
}


// Softozor data
const softozorData = {
	src : "softozor.png",
	alt : "Softozor",
	originalDeltaXW : 50, // right shift in *W units
	minYW : 2,
	maxYW : 90,
	heightW : 10,
	xSpeed : 0.5,
	gravity : 0.05,
	flapStrength : 1.5,
	hitDownSpeed : 0.1
};

// Softozor
var softozor = {
	
	xW : 0,
	deltaXW : softozorData.originalDeltaXW,
	yW : softozorData.minYW,
	ySpeed : 0,
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
		
		this.hitbox = new hitboxProto(this.position, softozorData.heightW * 0.3, softozorData.heightW * 0.9, softozorData.heightW * 0.1, softozorData.heightW * 0.7);
		
		this.updatePosition();
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
		this.hitCheck(obstacle[0]);
		
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
		if(this.yW < softozorData.maxYW) this.ySpeed += softozorData.flapStrength;
	},
	
	move : function(){
		this.xW += softozorData.xSpeed * transition;
	},
	
	// hit check
	hitCheck : function(){
		var length = obstacle.length;
		for(var i = 0; i < length; i++){
			var collision = this.hitbox.testHit(obstacle[i].hitbox);
			if(collision.type === "other right"){
				this.obstacleRight(collision.xWMin);
				scoreIncrement = 0;
			} else if(collision.type === "other up"){
				this.obstacleUp(collision.yWMin);
				scoreIncrement = 0;
			} else if(collision.type === "other down"){
				this.obstacleDown(collision.yWMax);
				scoreIncrement = 0;
			} else if(collision.type === "other behind" && !obstacle[i].passed){
				score += scoreIncrement;
				scoreIncrement ++;
				obstacle[i].passed = true;
			}
		}
	},
	
	// hit reactions
	obstacleRight : function(xWMin){
		this.deltaXW = xWMin - this.xW - this.hitbox.dxWMax;
	},
	
	obstacleUp : function(yWMin){
		this.ySpeed = Math.min(this.ySpeed, -softozorData.hitDownSpeed);
		this.yW = yWMin - this.hitbox.dyWMax;
	},
	
	obstacleDown : function(yWMax){
		this.ySpeed = Math.max(this.ySpeed, 0);
		this.yW = yWMax - this.hitbox.dyWMin;
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

// game initialization
(function (){

	// banner initialization
	banner.html = document.getElementById("banner");
	banner.widthPX = parseInt(window.getComputedStyle(banner.html, null).getPropertyValue("width"));
	banner.heightPX = parseInt(window.getComputedStyle(banner.html, null).getPropertyValue("height"));
	banner.html.setAttribute("onmouseenter", "run()");
	banner.html.setAttribute("onmouseleave", "stop()");
	banner.html.setAttribute("onclick", "softozor.flap()");
	banner.html.style.position = "relative";
	banner.html.style.overflow = "hidden";
	
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
	gameStopped.setAttribute("src", "gameStopped.png");
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
	scoreText.style.marginTop = "10px";
	scoreText.style.marginLeft = "10px";
	scoreText.style.color = "white";
	dashBoardDisplay.appendChild(scoreText);
	
	// obstacle initialization
	
	var x, y, birdIndex;
	for(birdIndex = 0; birdIndex < 20; birdIndex++){
		x = Math.random() * band[worldBandIndex].widthW;
		y = Math.random() * 100;
		obstacle[birdIndex] = chaffinch(x, y);
	}
	for(;birdIndex < 25; birdIndex++){
		x = Math.random() * band[worldBandIndex].widthW;
		y = Math.random() * 100;
		obstacle[birdIndex] = pigeon(x, y);
	}
	for(;birdIndex < 35; birdIndex++){
		x = Math.random() * band[worldBandIndex].widthW;
		y = Math.random() * 100;
		obstacle[birdIndex] = eagle(x, y);
	}
	
	/*
	var x, y, diameter, bubbleIndex;
	for(bubbleIndex = 0; bubbleIndex < 50; bubbleIndex++){
		x = Math.random() * band[worldBandIndex].widthW;
		y = Math.random() * 100;
		diameter = 5 + Math.random() * 20;
		obstacle[bubbleIndex] = bubble(x, y, diameter);
	}*/
	
	// position initialization
	update();
})();


function obstacleProto(position, sprite, hitbox, obstacleIndex){
	this.position = position;
	this.sprite = sprite;
	this.hitbox = hitbox;
	this.obstacleIndex = obstacleIndex;
	this.passed = false;
	
	this.update = function(){
		this.sprite.update();
		
		// Visual reference for hitbox setup. Must be commentar in final game.
		// this.hitbox.testUpdate();
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

// hitbox prototype
function hitboxProto(position, dxWMin, dxWMax, dyWMin, dyWMax){
	this.position = position;
	
	this.dxWMin = dxWMin;
	this.dxWMax = dxWMax;
	this.dyWMin = dyWMin;
	this.dyWMax = dyWMax;
	
	this.collision = new collisionProto("no collision", 0, 0, 0, 0);
	
	// collision test optimized to be runned from softozor
	this.testHit = function(other){
		
		var xmin = this.position.xW + this.dxWMin;
		var xmax = this.position.xW + this.dxWMax;
		var otherxmin = other.position.xW + other.dxWMin;
		var otherxmax = other.position.xW + other.dxWMax;
		var ymin;
		var ymax;
		var cx;
		var cy;
		var otherymin;
		var otherymax;
		
		var thisUpZone;
		var thisDownZone;
		var thisUp;
		var thisLeft;
		
		if(xmax >= otherxmin && xmin <= otherxmax){
			
			ymin = this.position.yW + this.dyWMin;
			ymax = this.position.yW + this.dyWMax;
			otherymin = other.position.yW + other.dyWMin;
			otherymax = other.position.yW + other.dyWMax;
			
			if(ymax >= otherymin && ymin <= otherymax){
				
				this.collision.xWMin = otherxmin;
				this.collision.xWMax = otherxmax;
				this.collision.yWMin = otherymin;
				this.collision.yWMax = otherymax;
				
				cx = (xmin + xmax) / 2;
				cy = (ymin + ymax) / 2;
				
				thisUpZone = cx - otherxmin >= otherymax - cy && cx - otherxmax <= cy - otherymax;
				thisDownZone = cx - otherxmin >= cy - otherymin && cx - otherxmax <= otherymin - cy;
				thisUp = cy >= (otherymin + otherymax) / 2;
				thisLeft = cx <= (otherxmin + otherxmax) / 2;
				
				if(thisUpZone || thisDownZone){
					if(thisUp) this.collision.type = "other down";
					else this.collision.type = "other up";
				} else {
					if(thisLeft) this.collision.type = "other right";
					else this.collision.type = "other left";
				}
			} else if(ymax < otherymin) this.collision.type = "other over";
			else if(ymin > otherymax) this.collision.type = "other under";
		} else if(xmax < otherxmin) this.collision.type = "other in front";
		else if(xmin > otherxmax) this.collision.type = "other behind";
		
		return this.collision;
	}
	
	// Visual reference for hitbox setup. Must be commentar in final game.
	/*
	this.spritePosition = new positionProto(position.xW + dxWMin, position.yW + dyWMin, position.bandIndex);
	this.testSprite = new spriteProto(this.spritePosition, "hitBox.png", "Hitbox sprite reference", this.dxWMax - this.dxWMin, this.dyWMax - this.dyWMin, position.bandIndex);
	this.testSprite.html.style.opacity = "0.3";
	this.testUpdate = function(){
		this.spritePosition.xW = this.position.xW + dxWMin;
		this.spritePosition.yW = this.position.yW + dyWMin;
		this.testSprite.update();
	}
	*/
}

// collision prototype
function collisionProto(type, xWMin, xWMax, yWMin, yWMax){
	this.type = type;
	this.xWMin = xWMin;
	this.xWMax = xWMax;
	this.yWMin = yWMin;
	this.yWMax = yWMax;
}

// birds creators
function eagle(x, y){
	var pos = new positionProto(x, y, worldBandIndex);
	var spr = new spriteProto(pos, "eagle.png", "Eagle", 48, 20, worldBandIndex);
	var hit = new hitboxProto(pos, 15, 32, 2, 9);
	var bird = new obstacleProto(pos, spr, hit, 0);
	return bird;
}

function pigeon(x, y){
	var pos = new positionProto(x, y, worldBandIndex);
	var spr = new spriteProto(pos, "pigeon.png", "Pigeon", 24, 18, worldBandIndex);
	var hit = new hitboxProto(pos, 5, 15, 11, 17);
	var bird = new obstacleProto(pos, spr, hit, 0);
	return bird;
}

function chaffinch(x, y){
	var pos = new positionProto(x, y, worldBandIndex);
	var spr = new spriteProto(pos, "chaffinch.png", "Chaffinch", 16, 9, worldBandIndex);
	var hit = new hitboxProto(pos, 3, 12, 3, 7);
	var bird = new obstacleProto(pos, spr, hit, 0);
	return bird;
}


function bubble(x, y, diameter){
	var pos = new positionProto(x, y, worldBandIndex);
	var spr = new spriteProto(pos, "bubble.png", "Soap bubble", diameter, diameter, worldBandIndex);
	var hit = new hitboxProto(pos, diameter * 0.15, diameter * 0.85, diameter * 0.15, diameter * 0.85);
	var obs = new obstacleProto(pos, spr, hit, 0);
	return obs;
}

// run the game
function run(){
	clearInterval(runSpeed);
	runSpeed = setInterval(function(){ update(); }, 20);
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
	runSpeed = setInterval(function(){ update(); }, 20);
	transitionDirection = -1;
}

function scoreUpdate(){
	scoreText.innerHTML = "SCORE : " + score;
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
	var obstacleLength = obstacle.length;
	for(obstacleIndex = 0; obstacleIndex < obstacleLength; obstacleIndex++)	obstacle[obstacleIndex].update();
}

	
