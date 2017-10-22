var ContactLoader = {
  showForm: function (lang, elementId) {
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById(elementId).innerHTML = this.responseText;
      }
    };

    if (lang.empty) {
      lang = "en";
    }

    xmlhttp.open("GET", "scripts/getContactForm.php?&lang=" + lang, true);
    xmlhttp.send();
  }
};
