import { AccordionLoader } from './AccordionLoader'
import { ContactLoader } from './ContactLoader'

const MainNavigation = {
  load: function (file, callback) {
    if (typeof callback === 'function') {
      $("#content").load(file, callback);
    } else {
      $("#content").load(file);
    }
  }
};

$(document).ready(function () {
  $("nav#navigation a").click(function () {
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
});