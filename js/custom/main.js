const baseUrl = 'http://eazywash.dk/advanced/backend/web/';
//var baseUrl = 'http://thisisbig.ae/advanced/backend/web/';


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

//initialise and setup facebook js sdk
window.fbAsyncInit = function() {
  FB.init({
    appId: "630548993961819",
    autoLogAppEvents: true,
    xfbml: true,
    version: "v2.12"
  });
  FB.getLoginStatus(function(response) {
    console.log(response);
    if (response.status === "connected") {
      //  document.getElementById('status').innerHTML ="You are connected." ;
    } else if (response.status === "not authorized") {
      // document.getElementById('status').innerHTML ='we are not logged in.';
    } else {
      // document.getElementById('status').innerHTML ='You are logged into the facebook';
    }
  });
};

(function(d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

function login() {
  FB.login(
    function(response) {
      if (response.status === "connected") {
        FB.api("/me", { locale: "en_US", fields: "name, email" }, function(
          res
        ) {
          $.ajax({
            type: "POST",
            url: baseUrl + "customersapi/create",
            data: {
              full_name: res.name,
              email: res.email,
              facebook_id: res.id,
              password: "",
              phone: "",
              sex: ""
            },
            success: function(ress) {
              console.log(ress.id);
              let check = document.getElementsByClassName("rememberMeCheck")[0];
              localStorage.setItem("laundryUser", ress.id);

              let date = new Date();
              if (check) {
                localStorage.setItem("rememberMe", "y");
                let date1 = new Date(
                  date.setDate(date.getDate() + 10)
                ).toUTCString();
                document.cookie = "laundryCookie=y; expires=" + date1;
              } else {
                localStorage.removeItem("rememberMe");
                let date1 = new Date(
                  date.setHours(date.getHours() + 1)
                ).toUTCString();
                document.cookie = "laundryCookie=y; expires=" + date1;
              }

              test();

              location.reload();
            },
            error: function(err) {
              console.log(err);
            }
          });

          function test() {
            FCMPlugin.getToken(function(token) {
              let x = localStorage.getItem("laundryUser");
              $.ajax({
                type: "PUT",
                url: baseUrl + "customersapi/update/?id=" + x,
                data: {
                  token: token
                },
                success: function(ress) {},
                error: function(err) {
                  console.log(err);
                }
              });
            });
          }
        });
        console.log(response);
        //  document.getElementById('status').innerHTML ='You are connected.' ;
      } else if (response.status === "not authorized") {
        // document.getElementById('status').innerHTML ='we are not logged in.';
      } else {
        // document.getElementById('status').innerHTML ='You are logged into the facebook.';
      }
    },
    { scope: "email" }
  );
}


$(document).ready(function () {
    $(".sidenav").sidenav();
});