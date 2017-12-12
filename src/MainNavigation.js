import { AccordionLoader } from './AccordionLoader'
import { ContactLoader } from './ContactLoader'

const MainNavigation = {
  load: function (file, callback) {
    if (typeof callback === 'function') {
      $("#content").load(file, callback);
    } else {
      $("#content").load(file);
    }
  },
  animateMenuLine: function () {
    var width = $("#navigation > ul").children().map(function (undefined, elem) {
      return $(elem).outerWidth(true);
    }).toArray().reduce(function (prev, curr) {
      return prev + curr;
      }, 0);

    $('#bottomLine').animate({
      width: width + "px"
    }, 4000);
  }, 
  setupMenu: function () {
    $("nav#navigation a, footer a").click(function () {
      const addressValue = $(this).attr("href").split("#")[1];
      if (addressValue === "team") {
        MainNavigation.load(`${addressValue}.html`, function () {
          AccordionLoader.showTeam("teamContent");
        });
      } else if (addressValue === "contact") {
        MainNavigation.load(`${addressValue}.html`, function () {
          ContactLoader.showForm("contactForm");
        });
      } else {
        MainNavigation.load(`${addressValue}.html`);
      }
    });
  }
};

$(document).ready(function () {
  MainNavigation.animateMenuLine();
  MainNavigation.setupMenu();
});