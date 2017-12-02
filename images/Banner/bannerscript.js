"use strict";

/* The html tag which will contain the banner must:  
		- have the attribute:	id="banner"
		- be followed by:		<script src="bannerscript.js"></script>
		- have a proper height
*/

// game frame pilot
var runSpeed;

// x position in percent of a 2000px long image with a speedFactor of 1
var x100 = 0; 

// bands render data
function bandData(src, alt, speedFactor) {
	this.src = src;
	this.alt = alt;
	this.speedFactor = speedFactor;
};
const bandDataList = [
	new bandData("sky.png", "Sky", 0),
	new bandData("clouds.png", "Clouds", 0.1),
	new bandData("back.png", "Back Mountains", 0.2),
	new bandData("mid.png", "Middle Mountains", 0.3),
	new bandData("front.png", "Front Mountains", 0.4),
	new bandData("worldBand.png", "World Band", 2)
	/*
	You can add or remove bands here.
	The last one will be in front of the others.
	*/
];

// one layer of the banner
function band(src, alt, speedFactor){
	this.src = src;
	this.alt = alt;
	this.speedFactor = speedFactor;
	this.imgRatio = 10;
	this.heightRatioToBanner = 1;
	this.widthPX = 2000;
	this.heightPX = 200;
	this.imgs = [];
	this.nImgs = 0;
	
	this.setPosition = function(){
		var index = 0;
		for(index = 0; index < this.nImgs; index++){
			this.imgs[index].setImgPosition();
		}
	}
	
	// extract image original ratio
	if(this.src.naturalHeight) this.imgRatio = this.src.naturalWidth / this.src.naturalHeight;
	
	// calculate band zoom
	this.heightRatioToBanner = 1 + this.speedFactor / 2;
		
	// calculate image dimentions
	this.widthPX = this.heightRatioToBanner * banner.heightPX * this.imgRatio;
	this.heightPX = this.heightRatioToBanner * banner.heightPX;
	
	// create images to fill banner
	while((this.nImgs - 1) * this.widthPX < banner.widthPX){
		this.imgs[this.nImgs] = new img(this, this.nImgs);
		this.nImgs++;
	}
}

// one image in a band
function img(bandRef, rank){ // the leftmost image has rank 0
	this.rank = rank;
	this.htmlRef;
	this.xPX = 0;
	this.yPX = 0;
	
	var parentBand = bandRef;
	
	this.setImgPosition = function(){
		this.xPX = (x100 * 2000 / 100 * parentBand.speedFactor) % parentBand.widthPX + this.rank * parentBand.widthPX;
		this.htmlRef.style.left = "" + this.xPX + "px";
	
		this.yPX = softozor.y100 * (banner.heightPX - parentBand.heightPX) / 100;
		this.htmlRef.style.bottom = "" + this.yPX + "px";
	}
	
	// image initialization
	this.htmlRef = document.createElement("img");
	this.htmlRef.setAttribute("src", parentBand.src);
	this.htmlRef.setAttribute("alt", parentBand.alt);
	this.htmlRef.style.position = "absolute";
	this.htmlRef.style.width = parentBand.widthPX + "px";
	this.htmlRef.style.height = parentBand.heightPX + "px";
		
	banner.html.appendChild(this.htmlRef);
}

// render values
var banner = {};
var imageBand = [];

// Softozor data
const softozorData = {
	src : "softozor.png",
	alt : "Softozor",
	gravity : 0.05,
	flapStrength : 1.5
};

// Softozor
var softozor = {
	
	deltaX100 : 20, // right shift in percent of banner width
	y100 : 2, // y position in percent of banner height 
	ySpeed : 0,
	html : undefined,
	
	initialize : function(){
		this.html = document.createElement("img");
		this.html.setAttribute("src", softozorData.src);
		this.html.setAttribute("alt", softozorData.alt);
		this.html.style.position = "absolute";
		this.html.style.height = "20%";
		banner.html.appendChild(this.html);
	},
	
	setPosition : function(){
		this.html.style.bottom = this.y100 + "%";
		this.html.style.left = this.deltaX100 + "%";
	},
	
	// constant fall
	fall : function () {
		if(this.y100 < 2) {
			this.ySpeed = Math.max(this.ySpeed, 0);
		}
		else if(this.y100 >= 2 && this.y100 < 90) this.ySpeed -= softozorData.gravity;
		else {
			this.ySpeed = Math.min(this.ySpeed,-0.1 );
		}
		this.ySpeed = Math.min(Math.max(this.ySpeed, -0.8 ), 3);
		this.y100 += this.ySpeed;
	},

	// flap up
	flap : function (){
		if(this.y100 < 90) this.ySpeed += softozorData.flapStrength;
	}
};

// game initialization
(function (){

	var bandIndex = 0;
	var data;
	
	// banner initialization
	banner.html = document.getElementById("banner");
	banner.widthPX = parseInt(window.getComputedStyle(banner.html, null).getPropertyValue("width"));
	banner.heightPX = parseInt(window.getComputedStyle(banner.html, null).getPropertyValue("height"));
	banner.html.setAttribute("onmouseenter", "run()");
	banner.html.setAttribute("onmouseleave", "stop()");
	banner.html.setAttribute("onclick", "softozor.flap()");
	banner.html.style.position = "relative";
	banner.html.style.overflow = "hidden";
	
	// bands initialization
	for(bandIndex = 0; bandIndex < bandDataList.length; bandIndex++){
		data = bandDataList[bandIndex];
		imageBand[bandIndex] = new band(data.src, data.alt, data.speedFactor);		
	}
	
	// Softozor initialization
	softozor.initialize();
	
	// position initialization
	updatePosition();
})();

// run the game
function run(){
	runSpeed = setInterval(function(){ update(); }, 20);
}

// stop the game
function stop(){
	clearInterval(runSpeed);
}

// game frame function
function update(){
	move();
	softozor.fall();
	updatePosition();
}

// game positions update
function updatePosition(){
	
	var bandIndex = 0;
	for(bandIndex = 0; bandIndex < imageBand.length; bandIndex++){
		imageBand[bandIndex].setPosition();
	}
	
	softozor.setPosition();
}

// constant move
function move(){
	x100 -= 0.1;
}

	
