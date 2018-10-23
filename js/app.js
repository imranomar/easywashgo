var baseUrl = "http://localhost/advanced/backend/web/";

window.addEventListener("beforeunload", function(e) {
  if (!localStorage.getItem("rememberMe")) {
    let date1 = new Date().toUTCString();
    document.cookie = "laundryCookie=y; expires=" + date1;
  }
});

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

var app = angular.module("laundryApp", ["ngRoute"]);

app.run(function($rootScope, updateFCMToken) {
  if (localStorage.getItem("laundryUser")) {
    updateFCMToken.test();
  }

  $rootScope.showBackBtn = false;
  $rootScope.$on("$routeChangeStart", function(event, currRoute, prevRoute) {
    debugger;
    var currentRouteDetails = currRoute.$$route;
    var showBackBtn = currentRouteDetails.showBackBtn;

    if (showBackBtn && showBackBtn == true) {
      $rootScope.showBackBtn = true;
    } else {
      $rootScope.showBackBtn = false;
    }
  });
});

app.config(function($routeProvider, $locationProvider) {
  let cookieName = "laundryCookie";
  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2)
      return parts
        .pop()
        .split(";")
        .shift();
  }

  $routeProvider
    .when("/login", {
      templateUrl: "views/login.html",
      resolve: {
        check: function($location) {
          if (getCookie(cookieName) == "y") {
            $location.path("/dashboard");
          }
        }
      }
    })
    .when("/signup", {
      templateUrl: "views/signup.html",
      resolve: {
        check: function($location) {
          if (getCookie(cookieName) == "y") {
            $location.path("/dashboard");
          }
        }
      }
    })
    .when("/forget", {
      templateUrl: "views/forget.html",
      resolve: {
        check: function($location) {
          if (getCookie(cookieName) == "y") {
            $location.path("/dashboard");
          }
        }
      }
    })
    .when("/dashboard", {
      templateUrl: "views/dashboard.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/menu", {
      templateUrl: "views/menu.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/pricing", {
      templateUrl: "views/pricing.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/aboutus", {
      templateUrl: "views/aboutus.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/faqs", {
      templateUrl: "views/faqs.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/mydetails", {
      templateUrl: "views/mydetails.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/notification", {
      templateUrl: "views/notifications.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/address", {
      templateUrl: "views/addresses.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/deliverydate", {
      templateUrl: "views/deliverydate.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/ordersummary", {
      templateUrl: "views/ordersummary.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/payment", {
      templateUrl: "views/paymentmethod.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/finaldate", {
      templateUrl: "views/selecttimefinal.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/task-details/:id", {
      templateUrl: "views/task-details.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      },
      showBackBtn: true
    })
    .when("/order-details/:id", {
      templateUrl: "views/order-details.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/myedit/:person", {
      templateUrl: "views/myedit.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/edit-address/:id", {
      templateUrl: "views/edit-address.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/edit-payment/:id", {
      templateUrl: "views/edit-payment.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/add-address", {
      templateUrl: "views/add-address.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/add-payment", {
      templateUrl: "views/add-payment.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .otherwise({
      redirectTo: "/login"
    });

  // use the HTML5 History API
  $locationProvider.html5Mode(false);
});

// route for the about page
// .when('/about/:person', {
//     templateUrl : 'pages/about.html',
//     controller  : 'aboutController'
// })

// http://localhost/advanced/backend/web/
app.factory("appInfo", function() {
  return {
    url: "http://localhost/advanced/backend/web/"
  };
});

app.factory("updateFCMToken", function(appInfo, $httpParamSerializer, $http) {
  return {
    test: function() {
      if (!window.cordova) {
        return;
      }
      FCMPlugin.getToken(function(token) {
        let x = localStorage.getItem("laundryUser");
        let data = {
          token: token
        };
        let req = {
          method: "PUT",
          url: appInfo.url + "customersapi/update/?id=" + x,
          data: $httpParamSerializer(data),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };
        $http(req)
          .then(function(res) {
            console.log(res);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    }
  };
});

app.directive("itemFloatingLabel", function() {
  return {
    restrict: "C",
    link: function(scope, element) {
      var el = element[0];
      var input = el.querySelector("input, textarea");
      var inputLabel = el.querySelector(".input-label");

      if (!input || !inputLabel) return;

      var onInput = function() {
        if (input.value) {
          inputLabel.classList.add("has-input");
        } else {
          inputLabel.classList.remove("has-input");
        }
      };

      input.addEventListener("input", onInput);

      scope.$on("$destroy", function() {
        input.removeEventListener("input", onInput);
      });
    }
  };
});
