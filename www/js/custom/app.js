var app = angular.module("laundryApp", ["ngCordova", "ngStorage", "ngRoute", "ngValidate"]);

app.run(function($rootScope, AppService) {
  AppService.initialize();

  /* Check Internet Connection */
  // $rootScope.online = navigator.onLine;
  // $window.addEventListener("offline", function () {
  //   $rootScope.$apply(function() {
  //     $rootScope.online = false;
  //   });
  // }, false);
  // $window.addEventListener("online", function () {
  //   $rootScope.$apply(function() {
  //     $rootScope.online = true;
  //   });
  // }, false);

  /* Constants */
  $rootScope.Constant = {
    TASK_TYPE: {
      PICKUP_TASK: 1,
      DROP_TASK: 2
    },
    TASK_STATUS: {
      OPEN: 0,
      CLOSE: 1
    },
    ORDER_STATUS: {
      ORDERED: 0,
      PICKED_UP: 1,
      DROPPED: 2
    },
    CARD_TYPES: {
      MC: "Master Card",
      VISA: "VISA Card",
      DK: "Dankort Card",
      "V-DK": "VISA/Dankort Card",
      ELEC: "VISA Electron Card"
    }
  };

  $rootScope.$on("$routeChangeStart", function(event, currRoute, prevRoute) {
    var currentRouteDetails = currRoute.$$route;
    var showBackBtn =
      currentRouteDetails && currentRouteDetails.showBackBtn == true
        ? true
        : false;
    var hideNavBar =
      currentRouteDetails && currentRouteDetails.hideNavBar == true
        ? true
        : false;

    if (showBackBtn && showBackBtn == true) {
      $rootScope.showBackBtn = true;
    } else {
      $rootScope.showBackBtn = false;
    }

    if (hideNavBar && hideNavBar == true) {
      $rootScope.hideNavBar = true;
    } else {
      $rootScope.hideNavBar = false;
    }
  });
});

app.factory("AppService", function($rootScope, $cordovaNetwork, FCMService) {
  return {
    initialize: function() {
      document.addEventListener(
        "deviceready",
        function() {
          $rootScope.isOnline = true;

          $rootScope.network = $cordovaNetwork.getNetwork();
          $rootScope.isOnline = $cordovaNetwork.isOnline();
          
          // listen for Online event
          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
              $rootScope.isOnline = true;
              $rootScope.network = $cordovaNetwork.getNetwork();
          })
  
          // listen for Offline event
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
              console.log("got offline");
              $rootScope.isOnline = false;
              $rootScope.network = $cordovaNetwork.getNetwork();
          })

          FCMService.generateToken();
        },
        false
      );
    }
  };
});

app.factory('FCMService', function ($rootScope, appInfo, $httpParamSerializer,$http) {
  return {
    generateToken: function() {
      if(!device.cordova) {
         return;
      }
      
      FCMPlugin.getToken(function(token) {
        
        $rootScope.fcm_token = token;

        FCMPlugin.onNotification(function(data) {
          //alert(data);
        });
      });
    }
  }
  
});

app.factory("CommonService", function(
  $http,
  $q,
  $httpParamSerializer,
  appInfo
) {
  var LOCALSTORAGE_USER = "laundryUser";
  var LOCALSTORAGE_REMEMBER_ME = "rememberMe";
  var LOCALSTORAGE_DATE_FILTERED = "task_filtered";

  return {
    storeUserDetailsLocal: function(data, isChecked) {
      localStorage.setItem(LOCALSTORAGE_USER, data);

      var date = new Date();
      var date1 = "";

      if (isChecked == true) {
        localStorage.setItem(LOCALSTORAGE_REMEMBER_ME, "y");
        date1 = new Date(date.setDate(date.getDate() + 10)).toUTCString();
      } else {
        localStorage.removeItem(LOCALSTORAGE_REMEMBER_ME);
        date1 = new Date(date.setHours(date.getHours() + 1)).toUTCString();
      }
      document.cookie = "laundryCookie=y; path= /; expires=" + date1;
    },
    removeUserDetailsLocal: function() {
      document.cookie = "laundryCookie=y; path= /; expires=expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      localStorage.removeItem(LOCALSTORAGE_USER);
      localStorage.removeItem(LOCALSTORAGE_REMEMBER_ME);
    },
    storeTaskFilterDateLocal: function(date) {
      localStorage.setItem(LOCALSTORAGE_DATE_FILTERED, date);
    },
    getTaskFilterDateLocal: function() {
      var date = localStorage.getItem(LOCALSTORAGE_DATE_FILTERED);

      if(!date) {
        return false;
      }
      return date;
    },
    removeTaskFilterDateLocal: function() {
      localStorage.removeItem(LOCALSTORAGE_DATE_FILTERED);
    },
    CallAjaxUsingPostRequest: function(partialUrl, dataObject, isJson) {
      var defer = $q.defer();
      
      var request = {
        method: "POST",
        url: appInfo.url + partialUrl
      };
      
      if(isJson == true) {
        request.data = dataObject;
      } else {
        request.data = $httpParamSerializer(dataObject),
        request.headers = { 
          "Content-Type": "application/x-www-form-urlencoded"
        };
      }

      $http(request)
        .success(function(data, status, header, config) {
          defer.resolve(data);
        })
        .error(function(data, status, header, config) {
          defer.reject(status);
        });
      return defer.promise;
    },
    CallAjaxUsingGetRequest: function(partialUrl) {
      var defer = $q.defer();
      $http({
        method: "GET",
        url: appInfo.url + partialUrl
      })
        .success(function(data, status, header, config) {
          defer.resolve(data);
        })
        .error(function(data, status, header, config) {
          defer.reject(status);
        });
      return defer.promise;
    },
    GeneratePaymentForm: function(order_id, ticket, total_amount, order_text) {
      var html = '';
      html += '<style>html{ overflow: hidden; } </style>';
      html += '<div class="payment-loader">';
      html += '<h3 align="center"> Loading... </h3>';
      html += '</div>';
      html += '<form action="https://payment.architrade.com/cgi-ssl/ticket_auth.cgi" method="post">';
      html += '<input type="hidden" name="merchant" value="90246240" />';
      html += '<input type="hidden" name="ticket" value="'+ ticket + '" />';
      html += '<input type="hidden" name="amount" value="'+ total_amount + '" />';
      html += '<input type="hidden" name="currency" value="578" />';
      html += '<input type="hidden" name="orderid" value="'+ order_id +'" />';
      html += '<input type="hidden" name="preauth" value="1" />';
      html += '<input type="hidden" name="test" value="1" />';
      html += '<input type="hidden" name="ordertext" value="'+ order_text +'" />';
      html += '<input type="hidden" name="accepturl" value="' + baseUrl + 'order/paymentcallback" />';
      html += '<input type="hidden" name="declineurl" value="' + baseUrl + 'order/paymentcallback" />';
      html += '<input type="submit" id="submit" name="submit" style="visibility:hidden" /> ';
      html += '</form>';
      html += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
      html += '<script>$("#submit").click();</script>';

      return html;
    }

  };
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
      },
      hideNavBar: true
    })
    .when("/forget", {
      templateUrl: "views/forget.html",
      resolve: {
        check: function($location) {
          if (getCookie(cookieName) == "y") {
            $location.path("/dashboard");
          }
        }
      },
      hideNavBar: true
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
    .when("/payment-success/:type/:id", {
      templateUrl: "views/payment-success.html",
      resolve: {
        check: function($location) {
          if (!getCookie(cookieName)) {
            $location.path("/login");
          }
        }
      }
    })
    .when("/payment-error/:type/:id", {
      templateUrl: "views/payment-error.html",
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

// http://localhost/advanced/backend/web/
app.factory("appInfo", function() {
  return {
    url: baseUrl
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

app.filter('TaskHeading', function ($filter, $sce) {
    return function (date) {
      var text = "";

      var newDate = new Date();
      var currentDate = newDate.getDate();

      var filterDate = date.getDate();
      
      if(filterDate == currentDate - 1) {
        text = 'Yesterday';
      } else if(filterDate == currentDate) {
        text = 'Today ';
      } else if (filterDate  == currentDate + 1) {
        // if day is day after
        text = 'Tomorrow';
      // } else if (filterDate == currentDate + 2) {
      //   // if day is day after
      //   text = "Day After Tomorrow";
      } else {
        text = $filter('date')(date, 'EEEE');
      }

      text += ' - ' + $filter('date')(date, 'd MMM, yyyy');
      
      return $sce.trustAsHtml(text);
    }
 });