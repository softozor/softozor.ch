var AccordionLoader = {
  toggle: function (param) {
    param.classList.toggle("active");
    var panel = param.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  },
  showTeam: function (lang) {
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("teamContent").innerHTML = this.responseText;
      }
    };

    if (lang.empty) {
      lang = "en";
    }

    xmlhttp.open("GET", "getTeam.php?lang=" + lang, true);
    xmlhttp.send();
  }
};
