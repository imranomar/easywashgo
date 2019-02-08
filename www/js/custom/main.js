//const baseUrl = 'http://192.168.1.12/advanced/backend/web/';
const baseUrl = 'http://eazywash.dk/advanced/backend/web/';


window.addEventListener("beforeunload", function(e) {
  if (!localStorage.getItem("rememberMe")) {
    let date1 = new Date().toUTCString();
    document.cookie = "laundryCookie=y; path= /; expires=" + date1;
  }
});

window.addEventListener('message', function(e) {
  var data = e.data;
  if(data.payment_success == true) {
    $('.top_bar .app-logo').trigger('click');
  } else if(data.payment_success == false) {
    location.reload()
  }
}, false);

$(document).ready(function () {
    $(".sidenav").sidenav();
});