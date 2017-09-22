function load(menuItem) {
    "use strict";
    var fileToLoad;
    // TODO: use a global array or something
    if (menuItem == "blog") {
        fileToLoad = "blog.html";
    } else if (menuItem == "contact") {
        fileToLoad = "contact.html"
    } else if (menuItem == "team") {
        fileToLoad = "team.html"
    }
    /*    document.getElementById("content").innerHTML = //'bla'; //'<section id="blog" class="anArticle"><h3>Blog</h3><h4>Le blog don</h4></section>';
            '<object type="text/html" data="' + fileToLoad + '"></object>';*/
    $("#content").load(fileToLoad);
}
