var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var imgWidth = document.getElementById("bannerImg").width;
var imgHeight = document.getElementById("bannerImg").height;
if (imgWidth > w) {
  document.getElementById("bannerImg").style.marginLeft = (w - imgWidth) + "px";
}
