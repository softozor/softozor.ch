document.addEventListener("click", function (event) {
  if (event.target.id != "burger-check" && event.target.id != "burger") {
    document.getElementById("burger-check").checked = false;
  }
});

$('#navigation ul li a').on('click', function () {
  $(this).parent().parent().children().children().removeClass('selected');
  $(this).addClass('selected');
});
