var AccordionLoader = {
  resetPanel: function (panel) {
    panel.style.maxHeight = null;
    panel.style.borderWidth = null;
    panel.style.borderColor = "white";
  },
  deactivateAll: function (param) {
    var accs = document.getElementsByClassName("accordion");
    for (var i = 0; i < accs.length; ++i) {
      if (accs[i] == param) {
        continue;
      }
      var panel = accs[i].nextElementSibling;
      if (panel.style.maxHeight) {
        accs[i].classList.toggle("active");
        AccordionLoader.resetPanel(panel);
      }
    }
  },
  toggle: function (param) {
    AccordionLoader.deactivateAll(param);
    param.classList.toggle("active");
    var panel = param.nextElementSibling;
    if (panel.style.maxHeight) {
      AccordionLoader.resetPanel(panel);
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      //panel.style.borderColor = getComputedStyle(document.body).getPropertyValue('--principalColor');
      panel.style.borderStyle = "solid";
      panel.style.borderWidth = "2px";
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

    xmlhttp.open("GET", "scripts/getTeam.php?lang=" + lang, true);
    xmlhttp.send();
  }
};
