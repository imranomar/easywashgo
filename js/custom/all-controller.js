//Login of Controller
app.controller("LoginCtrl", function(
  $scope,
  $location,
  $http,
  appInfo,
  updateFCMToken
) {
  $(".navbar-fixed").hide();

  // console.log(updateFCMToken.test());
  $scope.loading = false;
  $scope.field = "email";
  $scope.logindata = {
    email: "",
    password: ""
  };
  $scope.err = false;
  $scope.required = false;
  $scope.checkbox = true;

  $scope.loginsubmit = function() {
    $scope.err = false;
    $scope.required = false;

    let email = $scope.logindata.email;
    let password = $scope.logindata.password;

    if (!email || !password) {
      if (!email) {
        $scope.field = "please enter valid email address";
      } else if (!password) {
        $scope.field = "please enter password field";
      }
      $scope.required = true;
      return;
    }
    $scope.loading = true;
    $http
      .get(
        appInfo.url +
          "customersapi/authenticate?email=" +
          email +
          "&password=" +
          password
      )
      .then(function(res) {
        console.log(res);
        $scope.loading = false;
        if (res.data != 0) {
          localStorage.setItem("laundryUser", res.data);
          let date = new Date();
          updateFCMToken.test();
          if ($scope.checkbox == true) {
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
          $location.path("/dashboard");
        } else {
          $scope.err = true;
        }
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log("error");
        console.log(err);
      });
  };
});

// Signup of Controller

app.controller("SignupCtrl", function(
  $scope,
  $httpParamSerializer,
  $http,
  appInfo,
  $location,
  updateFCMToken
) {
  $scope.signupdata = [];
  $scope.signupsubmitform = function() {
    $scope.loading = true;
    let data = {
      full_name: $scope.signupdata.name,
      email: $scope.signupdata.email,
      password: $scope.signupdata.password,
      sex: "0"
    };
    let req = {
      method: "POST",
      url: appInfo.url + "customersapi/create",
      data: $httpParamSerializer(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    $scope.err = "";
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
        let date = new Date();
        localStorage.setItem("laundryUser", res.data.id);
        updateFCMToken.test();
        let date1 = new Date(date.setHours(date.getHours() + 1)).toUTCString();
        document.cookie = "laundryCookie=y; expires=" + date1;
        $location.path("/dashboard");
      })
      .catch(function(error) {
        $scope.loading = false;
        let err = error.data;
        $scope.err = err[0].message;
        // console.log(error);
      });
  };
});

// Forget password of Controller

app.controller("ForgetCtrl", function($scope) {
  $scope.forgetdata1 = [];

  $scope.sendemail = function() {
    console.log($scope.forgetdata1);
  };
});

// Dashboard of Controller

app.controller("DashboardCtrl", function(
  $scope,
  $location,
  $http,
  appInfo,
  $httpParamSerializer,
  updateFCMToken
) {
  $(".navbar-fixed").show();
  $(".sidenav").sidenav("close");
  debugger;
  $scope.filterIndex = -1;
  $scope.filters = ["9-12", "12-15", "15-18", "18-21"];

  $scope.all_tasks_list = [];
  $scope.tasks_list = [];

  $scope.err = "";
  $scope.loading = true;

  $scope.avaliableTime;

  $http
    .get(appInfo.url + "tasksapi?expand=order,address,customer")
    .then(function(res) {
      console.log(res.data);
      $scope.all_tasks_list = res.data;
      $scope.FilterTaskByHour();
    })
    .catch(function(err) {
      console.log(err);
    });

  $scope.FilterTaskByHour = function() {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();

    var index = $scope.filters.findIndex(function(item) {
      var arr = item.split("-");
      return currentHour >= parseInt(arr[0]) && currentHour <= parseInt(arr[1]);
    });
    $scope.FilterTaskList(index);
  };

  $scope.FilterTaskList = function(filterIndex) {
    $scope.filterIndex = filterIndex;

    if (filterIndex == -1) {
      $scope.tasks_list = $scope.all_tasks_list;
    } else {
      debugger;
      var hours = $scope.filters[filterIndex].split("-");

      $scope.tasks_list = $scope.all_tasks_list.filter(function(task) {
        var order = task.order;
        if (task.type == 1) {
          return (
            order.pickup_time_from >= parseInt(hours[0]) &&
            order.pickup_time_to <= parseInt(hours[1])
          );
        } else {
          return (
            order.drop_time_from >= parseInt(hours[0]) &&
            order.drop_time_to <= parseInt(hours[1])
          );
        }
      });
    }
  };

  $scope.menuopen = function() {
    //$location.path("/menu");
  };

  $scope.closemenu = function() {
    angular.element(".Menu").remove();
  };
});

// Menu of Controller

app.controller("MenuCtrl", function($scope, $location) {
  $scope.signout = function() {
    let date = new Date().toUTCString();
    document.cookie = "laundryCookie=y; expires=" + date;
    localStorage.removeItem("laundryUser");
    localStorage.removeItem("rememberMe");
    $location.path("/login");
  };

  $scope.closemenu = function() {
    $location.path("/dashboard");
    console.log("MenuCtrl");
  };
});

// pricing of Controller

app.controller("PricingCtrl", function($scope) {
  // body...
});

// Aboutus of Controller

app.controller("AboutusCtrl", function($scope) {
  // body...
});

// Frequently asked questions of Controller

app.controller("FaqsCtrl", function($scope) {
  $scope.questions = [
    {
      question: "How do I brighten my dingy white clothes and linens?",
      decription:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English."
    },
    {
      question:
        "How do I remove set-in stains that have been washed and dried?",
      decription:
        "washed and dried? Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "
    },
    {
      question: "How can I prevent fading of my dark clothes?",
      decription:
        "fading of my dark clothes? There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable."
    },
    {
      question: "How do I remove dye transfer from clothes?",
      decription:
        "dye transfer from clothes? Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for"
    },
    {
      question: "How do I remove yellow armpit stains?",
      decription:
        "yellow armpit stains? Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for"
    },
    {
      question: "How do I remove ink stains from clothes and leather?",
      decription:
        "ink stains from clothes and leather? Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for"
    },
    {
      question: "Why wont my washer/dryer work?",
      decription:
        "washer/dryer work? Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for"
    }
  ];

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
});

// My details Page of Controller

app.controller("MydetailsCtrl", function(
  $scope,
  $location,
  $http,
  appInfo,
  $httpParamSerializer
) {
  $(".navbar-fixed").show();
  $(".sidenav").sidenav("close");

  // body...
  $scope.loading = false;
  let x = localStorage.getItem("laundryUser");
  $scope.userdata = {};
  $scope.asteriskPassword = "";
  $scope.paymentDetails = [];
  $scope.cityids = [];
  getPayment();
  getAddress();
  getVault(x);

  function getPassword() {
    let p = $scope.userdata.password.split("").map(() => {
      return "*";
    });
    $scope.asteriskPassword = p.join("");
  }

  $(".edit-btn").click(function() {
    $(this).css("display", "none"); //working
    $(this)
      .parent()
      .parent()
      .find(".clk-fade-in")
      .css("display", "block");
    $(this)
      .parent()
      .parent()
      .find(".clk-fade-out")
      .css("display", "none");
    $(this)
      .parent()
      .parent()
      .find(".whn-clk-edt")
      .css("display", "block");
    $(this)
      .parent()
      .parent()
      .find(".form-control")
      .css("display", "block"); //working
    $(this)
      .parent()
      .parent()
      .find(".form-control")
      .focus(); //working
  });

  $(".whn-clk-edt").click(function() {
    $(this).css("display", "none"); //working
    $(this)
      .parent()
      .parent()
      .find(".clk-fade-in")
      .css("display", "none");
    $(this)
      .parent()
      .parent()
      .find(".clk-fade-out")
      .css("display", "block");
    $(this)
      .parent()
      .parent()
      .find(".whn-clk-edt")
      .css("display", "none");
    $(this)
      .parent()
      .parent()
      .find(".form-control")
      .css("display", "none"); //working
    $(this)
      .parent()
      .parent()
      .find(".form-control")
      .focus(); //working
    $(this)
      .parent()
      .parent()
      .find(".edit-btn")
      .css("display", "block");
  });

  $scope.onSavePersonDetail = function() {
    let data = {
      full_name: $scope.userdata.full_name,
      email: $scope.userdata.email,
      password: $scope.userdata.password,
      phone: $scope.userdata.phone
    };

    let req = {
      method: "PUT",
      crossDomain: true,
      url: appInfo.url + "customersapi/update/?id=" + x,
      data: $httpParamSerializer(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res);
        $scope.userdata.password = res.data.password;
        getPassword();
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  };

  function getAddress() {
    $http
      .get(appInfo.url + "customersapi/view/?id=" + x + "&expand=addresses")
      .then(function(res) {
        //   console.log(res.data);
        $scope.userdata = res.data;
        for (let value of $scope.userdata.addresses) {
          getcity(value.city_id);
        }
        getPassword();
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function getPayment() {
    //alert(appInfo.url+'customersapi/view/?id='+x+'&expand=payments');
    $http
      .get(appInfo.url + "customersapi/view/?id=" + x + "&expand=payments")
      .then(function(res) {
        $scope.loading = false;
        // console.log(res.data);
        $scope.userdata.payments = res.data.payments;
        //for(let value of  $scope.userdata.payments){
        //getVault(value.vault_id);
        //}
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  }

  function getVault(id) {
    //alert(appInfo.url+'vaultapi/view/?id='+id);
    $scope.loading = true;
    $http
      .get(appInfo.url + "customersapi/view/?id=" + x + "&expand=vault")
      .then(function(res) {
        $scope.loading = false;
        for (let value of res.data.vault) {
          $scope.paymentDetails.push(value);
        }
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  }

  function getcity(city) {
    $http
      .get(appInfo.url + "citiesapi/view?id=" + city)
      .then(function(res) {
        console.log(res.data);
        $scope.cityids.push(res.data);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

// Load Notification Page of Controller

app.controller("NotificationCtrl", function($scope) {
  $scope.notificationtoday = [
    {
      todayname: "LAUNDRY PICKUP TODAY",
      timing: "AT 8:00 AM",
      date: "Thu 17th August 2017"
    },
    {
      todayname: "LAUNDRY PICKUP TODAY",
      timing: "AT 8:00 AM",
      date: "Thu 17th August 2017"
    },
    {
      todayname: "LAUNDRY PICKUP TODAY",
      timing: "AT 8:00 AM",
      date: "Thu 17th August 2017"
    },
    {
      todayname: "LAUNDRY PICKUP TODAY",
      timing: "AT 8:00 AM",
      date: "Thu 17th August 2017"
    },
    {
      todayname: "LAUNDRY PICKUP TODAY",
      timing: "AT 3:00 AM",
      date: "Thu 17th August 2017"
    }
  ];

  $scope.laundrypickup = [
    {
      todayname: "LAUNDRY PICKUP",
      timing: "IN 1 HOUR!"
    },
    {
      todayname: "LAUNDRY PICKUP",
      timing: "IN 1 HOUR!"
    },
    {
      todayname: "LAUNDRY PICKUP",
      timing: "IN 1 HOUR!"
    }
  ];
});

// Load addresses page of controller

app.controller("AddressesCtrl", function(
  $scope,
  $http,
  appInfo,
  $location,
  $httpParamSerializer
) {
  $scope.loading = false;
  let x = localStorage.getItem("laundryUser");
  $scope.userdata = {};
  $scope.cityids = [];
  $scope.cityData = [];
  getAddress();
  getAllcity();

  $("body").on("click", ".magic-edit", function() {
    $(this).css("display", "none");
    $(this)
      .siblings(".magic-check")
      .css("display", "block");
    $(this)
      .siblings(".magic-input")
      .css("display", "block");
    $(this)
      .siblings(".main-data")
      .css("display", "none");
  });

  $("body").on("click", ".magic-check", function() {
    $(this).css("display", "none");
    $(this)
      .siblings(".magic-edit")
      .css("display", "block");
    $(this)
      .siblings(".magic-input")
      .css("display", "none");
    $(this)
      .siblings(".main-data")
      .css("display", "block");
  });

  $("body").on("click", ".magic-check", function() {
    let bodyfont = $(this).parents(".bodyfont");

    var streetname = bodyfont.find('.xxx-control[name="streetname"]').val();
    var pobox = bodyfont.find('.xxx-control[name="pobox"]').val();
    var floor = bodyfont.find('.xxx-control[name="floor"]').val();
    var city = bodyfont.find('.xxx-control[name="city"]').val();
    var id = bodyfont.find('.id[name="id"]').val();
    var index = bodyfont.find('.index[name="index"]').val();

    let data = {
      street_name: streetname,
      floor: floor,
      pobox: pobox,
      city_id: city
    };

    let req = {
      method: "PUT",
      url: appInfo.url + "addressesapi/update?id=" + id,
      data: $httpParamSerializer(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
        console.log("address");
        $scope.userdata.addresses[index] = res.data;
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  });

  $scope.onDelteAddress = function(data) {
    let req = {
      method: "DELETE",
      url: appInfo.url + "addressesapi/delete?id=" + data.id,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.err = "";
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
        getAddress();
      })
      .catch(function(error) {
        $scope.loading = false;
        let err = error.data;
        $scope.err = err[0].message;
        // console.log(error);
      });
  };

  function getAddress() {
    $scope.loading = true;
    $http
      .get(appInfo.url + "customersapi/view/?id=" + x + "&expand=addresses")
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data.id);
        $scope.getAddressId = res.data.id;

        $scope.userdata = res.data;
        for (let value of $scope.userdata.addresses) {
          getcity(value.city_id);
        }
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  }

  function getcity(city) {
    $http
      .get(appInfo.url + "citiesapi/view?id=" + city)
      .then(function(res) {
        console.log(res.data);
        $scope.cityids.push(res.data);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function getAllcity() {
    $http
      .get(appInfo.url + "citiesapi")
      .then(function(res) {
        $scope.cityData = res.data;
        console.log($scope.cityData);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

// Load Controller of DeliverydateCtrl

app.controller("DeliverydateCtrl", function($scope) {
  // body...
});

app.controller("TaskDetailsCtrl", function(
  $scope,
  $routeParams,
  $http,
  appInfo,
  $httpParamSerializer,
  $location
) {

  //  localstorage keys
  var task_id = $routeParams.id;
  var task_status = 0;

  $scope.customer_id = localStorage.getItem("laundryUser");
  $scope.err = "";
  $scope.loading = true;

  $scope.popupErr = "";
  $scope.popupLoading = false;

  $scope.closetaskdetails = {
    id: null,
    other_id: null,
    comments: null
  };

  $scope.appoptions = {};
  $scope.laundrypricing = [];
  $scope.order_items = [];
  $scope.vault_details = {};

  $scope.filterIndex = 0;
  $scope.filterOptions = ["Upper Body", "Lower Body", "Non Wearable"];

  $scope.canGoPreviousStep = false;
  
  getVault();
  
  //get Vault details
  function getVault() {
    $http
      .get(appInfo.url + "customersapi/view/?id=" + $scope.customer_id + "&expand=vault")
      .then(function(res) {
        var vaults = res.data.vault;
        if(vaults && vaults.length > 0) {
          $scope.vault_details = vaults[vaults.length-1];
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  //get task details
  $http
    .get(
      appInfo.url +
        "tasksapi/view/?id=" +
        task_id +
        "&expand=order,address,customer"
    )
    .then(function(res) {
      console.log(res.data);
      $scope.task = res.data;

      //not picked get laundry pricing to close
      if ($scope.task.order && $scope.task.order.status != 2)
      {

        if($scope.task.type &&  $scope.task.type == 1)
        {
          $http
          .get(appInfo.url + "laundrypricingapi")
          .then(function(res) {
            $scope.loading = false;
            console.log(res.data);
            if (res.data && res.data.length > 0) 
            {
              var data = res.data;
              $scope.laundrypricing = data.map(function(el) 
              {
                var obj = Object.assign({}, el);
                obj.items_count = 0;
                return obj;
              });
            }
          })
          .catch(function(err) {
            console.log(err);
          });
        } 
        else
        {
          $http
          .get(appInfo.url + "optionsapi")
          .then(function(res) {
            if(res.data && res.data.length > 0)
            {
              $scope.appoptions = res.data[0];
              console.log($scope.appoptions);
            }
          })
          .catch(function(err) {
            console.log(err);
          });
          
          $http
          .get(appInfo.url + "ordersapi/view/?id=" +
          $scope.task.order_id +
          "&expand=items")
          .then(function(res) {
            $scope.loading = false;
            console.log(res.data);
            var result = res.data;
            if (result)
            {
              if(result.items && result.items.length > 0 ) 
              {
                $scope.order_items = result.items;
              }
            }
          })
          .catch(function(err) {
            console.log(err);
          });
        }   
      } 
      else
      {
        $scope.loading = false;
      } 
    })
    .catch(function(err) {
      console.log(err);
    });

    $scope.filterByCategory = function(item) 
    {
      if($scope.filterIndex > -1)
      {
        var filterValue = $scope.filterOptions[$scope.filterIndex];

        if(item.type == filterValue)
          return true;
        else
          return false;
      } 
      else 
      {
        return true;
      }
    }

    $scope.filterItems = function(index)
    {
      $scope.filterIndex = index;
    }

    $scope.addItem = function(id)
    {
      var index = $scope.laundrypricing.findIndex(function(item){
        return item.id == id
      })
      if(index > -1)
        $scope.laundrypricing[index].items_count +=1;
    }

    $scope.removeItem = function(id)
    {
      var index = $scope.laundrypricing.findIndex(function(item){
        return item.id == id
      })

      if(index > -1)
      {
        if($scope.laundrypricing[index].items_count > 0)
          $scope.laundrypricing[index].items_count -=1;
      }
    }

    $scope.filterByItemsCount = function(item) 
    {
      if(item.items_count > 0)
        return true;
      else 
        return false;
    }

    $scope.goNext = function()
    {
      $scope.canGoPreviousStep = true;
    }

    $scope.goPrevious = function() 
    {
      $scope.canGoPreviousStep = false;
    }

    $scope.ClosePickupTask = function()
    {
      if ($scope.closetaskdetails.id <= 0) {
        alert("Please enter id");
        console.log("Please enter id");
        return;
      }

      var selectedLaundryItems = $scope.laundrypricing.filter(function(item){
        return item.items_count > 0;
      }).map(function(item){
        var order_item = {};
        order_item.order_id = $scope.task.order_id;
        order_item.title = item.title;
        order_item.type = item.type;
        order_item.price = item.items_count * parseFloat(item.price);

        return order_item;
      });

      let req = {
        method: "POST",
        url: appInfo.url + "orderitemsapi/createmultiple",
        data: selectedLaundryItems,
        headers: {
          "Content-Type": "application/json"
        }
      };

      $scope.popupErr = "";
      $scope.popupLoading = true;

      $http(req)
        .then(function(res) {
          $scope.popupLoading = false;
          console.log(res.data);
          var data = res.data;
          if(data && data.Success == true) 
          {
            var order = $scope.task.order;
            order.pickup_close_id = $scope.closetaskdetails.id;
            order.pickup_close_other_id = $scope.closetaskdetails.other_id;
            order.pickup_close_comments = $scope.closetaskdetails.comments;
            order.status = 1;

            let req = {
              method: "PUT",
              url: appInfo.url + "ordersapi/update/?id="+ $scope.task.order_id,
              data: $httpParamSerializer(order),
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            };

            $http(req)
              .then(function(res) {
                  $scope.popupLoading = false;
                  console.log(res.data);
                  $scope.task.order.status = 1;
                  $('.modal-close').trigger('click');
                  alert("Pickup closed successfully");
              }).catch(function(error) {
                console.log(error);
                alert("Error while closing pickup");
                $scope.popupLoading = false;
              });
          }
          else
          {
            $scope.popupLoading = false;
            console.log(data.Message);
          }
        })
        .catch(function(error) {
          $scope.popupLoading = false;
          console.log(error);
        });
    }

    $scope.openModal = function(modalId) {
      $scope.paymentSubmitted = false;
      $('#'+modalId).modal('open');
    }

    $scope.getTotalAmount = function()
    {
      var totalAmount = 0;

      if($scope.task.order.same_day_pickup == 1 && ($scope.appoptions && $scope.appoptions.same_day_pickup_price))
      {
        totalAmount += parseFloat($scope.appoptions.same_day_pickup_price);
      }

      if($scope.task.order.pickup_price && $scope.task.order.pickup_price != '0')
      {
        totalAmount += parseFloat($scope.task.order.pickup_price);
      }

      if($scope.task.order.next_day_drop == 1 && ($scope.appoptions && $scope.appoptions.next_day_delivery_price))
      {
        totalAmount += parseFloat($scope.appoptions.next_day_delivery_price);
      }

      if($scope.task.order.drop_price && $scope.task.order.drop_price)
      {
        totalAmount += parseFloat($scope.task.order.drop_price);
      }

      angular.forEach($scope.order_items, function(value, key)
      {
        totalAmount += parseFloat(value.price);
      });
      return totalAmount
    }

    $scope.paymentSubmitted = false;
    $scope.makePayment = function() 
    {
      $scope.paymentSubmitted = true;

      var doc = document.getElementById("paymentForm").contentWindow.document;

      var html = '';
      html += '<style>html{ overflow: hidden; } </style>';
      html += '<div class="payment-loader">';
      html += '<h1> Please wait </h1>';
      html += '</div>';
      html += '<form action="https://payment.architrade.com/cgi-ssl/ticket_auth.cgi" method="post">';
      html += '<input type="hidden" name="merchant" value="90246240" />';
      html += '<input type="hidden" name="ticket" value="'+ $scope.vault_details.transact + '" />';
      html += '<input type="hidden" name="amount" value="'+ $scope.getTotalAmount()+ '" />';
      html += '<input type="hidden" name="currency" value="578" />';
      html += '<input type="hidden" name="orderid" value="'+ $scope.task.order_id +'" />';
      html += '<input type="hidden" name="preauth" value="1" />';
      html += '<input type="hidden" name="test" value="1" />';
      html += '<input type="hidden" name="accepturl" value="http://localhost/advanced/backend/web/order/paymentcallback" />';
      html += '<input type="hidden" name="declineurl" value="http://localhost/advanced/backend/web/order/paymentcallback" />';
      html += '<INPUT type="submit" id="submit" name="submit" style="visibility:hidden"  value="TICKET DEMO"> ';
      html += '</form>';
      html += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
      html += '<script>$("#submit").click();</script>';

      doc.open();
      doc.write(html);
      doc.close();
    }
    
});

app.controller("OrderdetailsCtrl", function(
  $scope,
  $routeParams,
  $http,
  appInfo,
  $httpParamSerializer,
  $location
) {
  $(".navbar-fixed").show();
  $(".sidenav").sidenav("close");

  $(document).ready(function() {
    $(".modal").modal();
  });

  //  localstorage keys
  var order_id = $routeParams.id;
  var order_status = 0;

  $scope.err = "";
  $scope.loading = true;

  //get order details
  $http
    .get(
      appInfo.url +
        "ordersapi/view/?id=" +
        order_id +
        "&expand=vault,address,customer"
    )
    .then(function(res) {
      $scope.loading = false;
      console.log(res.data);
      $scope.order = res.data;

      //not picked get laundry pricing to close
      if ($scope.order.status == 0) {
        $http
          .get(appInfo.url + "laundrypricingapi")
          .then(function(res) {
            $scope.loading = false;
            console.log(res.data);
            $scope.laundrypricing = res.data;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    })
    .catch(function(err) {
      console.log(err);
    });
});

// Load Controller of OrdersummaryCtrl

app.controller("OrdersummaryCtrl", function(
  $scope,
  $http,
  appInfo,
  $httpParamSerializer,
  $location
) {
  $(".navbar-fixed").show();
  $(".sidenav").sidenav("close");
  //  localstorage keys
  let localData = {
    pickupDate: {},
    pickupTime: {},
    deliveryDate: {},
    deliveryTime: {}
  };

  function getLocalStorageData() {
    let a = localStorage.getItem("Myorder");
    let obj = {};
    if (a) {
      obj = JSON.parse(a);
      return obj;
    }
    return null;
  }

  var days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  var months = new Array();
  months[0] = "January";
  months[1] = "February";
  months[2] = "March";
  months[3] = "April";
  months[4] = "May";
  months[5] = "June";
  months[6] = "July";
  months[7] = "August";
  months[8] = "September";
  months[9] = "October";
  months[10] = "November";
  months[11] = "December";
  let x = localStorage.getItem("laundryUser");
  $scope.getAddress;
  $scope.getpayment;

  function getObjectLength(obj) {
    return Object.keys(obj).length;
  }

  if (getLocalStorageData()) {
    localData = getLocalStorageData();
    $(".tab1").css("display", "none");
    console.log(getObjectLength(localData.pickupDate));
    if (getObjectLength(localData.deliveryTime) != 0) {
      getLocalDetail();
      $(".tab4")
        .siblings(".tab3")
        .css("display", "none");
      $(".tab4").css("display", "none");
      $(".tab4")
        .siblings(".tab5")
        .css("display", "block");
    } else if (getObjectLength(localData.deliveryDate) != 0) {
      functionForForth();
      $(".tab3")
        .siblings(".tab2")
        .css("display", "none");
      $(".tab3").css("display", "none");
      $(".tab3")
        .siblings(".tab4")
        .css("display", "block");
    } else if (getObjectLength(localData.pickupTime) != 0) {
      functionForThird();
      $(".tab2")
        .siblings(".tab1")
        .css("display", "none");
      $(".tab2").css("display", "none");
      $(".tab2")
        .siblings(".tab3")
        .css("display", "block");
    } else if (getObjectLength(localData.pickupDate) != 0) {
      functionForSecond();
      $(".tab1").css("display", "none");
      $(".tab1")
        .siblings(".tab2")
        .css("display", "block");
    } else {
      $(".tab1").css("display", "block");
      functionForFirst();
    }
  } else {
    $(".tab1").css("display", "block");
    functionForFirst();
  }

  // wizard one start
  $scope.datelist;
  $scope.getLocalDetail;
  function functionForFirst() {
    let date = new Date();
    let dateapi = [];
    let array = [];
    getDate();

    $scope.showAllDateList = false;
    function getDate() {
      $http
        .get(appInfo.url + "optionsapi")
        .then(function(res) {
          dateapi = res.data[0];
          console.log(dateapi);
          makeDate();
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    function makeDate() {
      let holidays = dateapi.holidays.split(",");
      let length = dateapi.holidays.split(",").length;
      if (dateapi.weekend) {
        length += 1;
      }
      for (var i = 0; i < 16 + length; i++) {
        let name = "";
        let price = "";
        date = new Date();
        let d = new Date(date.setDate(date.getDate() + i));
        if (d.getDate() == new Date().getDate()) {
          // if  day is tomorrow
          name = "Today";
          price = dateapi.same_day_pickup_price;
        } else if (d.getDate() == new Date().getDate() + 1) {
          // if day is day after
          name = "Tomorrow";
        } else {
          name = days[d.getDay()];
        }

        array.push({
          date: d,
          name: name,
          price: price,
          shortDate: d.getDate() + "th " + months[d.getMonth()]
        });
      }

      for (var i = 0; i < array.length; i++) {
        for (let j = 0; j < holidays.length; j++) {
          if (array[i]) {
            if (
              array[i].date.toLocaleDateString() ==
              new Date(holidays[j] * 1000).toLocaleDateString()
            ) {
              array.splice(i, 1);
            }
          }
        }

        if (dateapi.weekend) {
          if (array[i]) {
            if (days.indexOf(dateapi.weekend) > -1) {
              if (array[i].date.getDay() == days.indexOf(dateapi.weekend)) {
                array.splice(i, 1);
              }
            }
          }
        }
      }
      array.length = 15;
      $scope.datelist = array;
      console.log($scope.datelist);
    }
  }

  $scope.onOther = function() {
    $scope.showAllDateList = true;
    $("#row_other").hide();
  };
  // wizard one closed

  // wizard three  start
  $scope.datelist1;
  $scope.showAllDateList1 = false;
  function functionForThird() {
    let date1 = new Date(getLocalStorageData().pickupDate.date);
    let pickupD = new Date(getLocalStorageData().pickupDate.date);
    let dateapi1 = [];
    let array1 = [];

    getDate1();
    function getDate1() {
      $http
        .get(appInfo.url + "optionsapi")
        .then(function(res) {
          dateapi1 = res.data[0];
          console.log(dateapi1);
          makeDate1();
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    function makeDate1() {
      let holidays1 = dateapi1.holidays.split(",");
      let length1 = dateapi1.holidays.split(",").length;
      if (dateapi1.weekend) {
        length1 += 1;
      }
      for (var i = 0; i < 16 + length1; i++) {
        let name = "";
        let price = "";
        let d1 = new Date(date1.setDate(date1.getDate() + 1));
        if (d1.getDate() == new Date().getDate() + 1) {
          // if day is day after
          name = "Tomorrow";
          price = dateapi1.next_day_delivery_price;
        } else if (d1.getDate() == pickupD.getDate() + 1) {
          // if  day is tomorrow
          // name = 'day after';
          name = "next day";
          price = dateapi1.next_day_delivery_price;
        }

        array1.push({
          date: d1,
          name: name,
          price: price,
          shortDate: d1.getDate() + "th " + days[d1.getDay()]
        });
      }
      for (var i = 0; i < array1.length; i++) {
        for (let j = 0; j < holidays1.length; j++) {
          if (array1[i]) {
            if (
              array1[i].date.toLocaleDateString() ==
              new Date(holidays1[j] * 1000).toLocaleDateString()
            ) {
              array1.splice(i, 1);
            }
          }
        }
        if (array1[i]) {
          if (dateapi1.weekend) {
            if (days.indexOf(dateapi1.weekend) > -1) {
              if (array1[i].date.getDay() == days.indexOf(dateapi1.weekend)) {
                array1.splice(i, 1);
              }
            }
          }
        }
      }
      array1.length = 15;
      $scope.datelist1 = array1;
    }
  }

  $scope.onOther1 = function() {
    $scope.showAllDateList1 = true;
  };
  // wizard three closed

  // wizard two open
  $scope.TimeSlot;
  function functionForSecond() {
    getTimeSlot();
    function getTimeSlot() {
      $http
        .get(appInfo.url + "slotspricingapi?sort=time_from")
        .then(function(res) {
          $scope.Timeslot = res.data;
          console.log($scope.Timeslot);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
  // wizard two closed

  // wizard four open
  $scope.TimeSlot1;
  function functionForForth() {
    getTimeSlot1();
    function getTimeSlot1() {
      $http
        .get(appInfo.url + "slotspricingapi?sort=time_from")
        .then(function(res) {
          $scope.Timeslot1 = res.data;
          console.log($scope.Timeslot1);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
  // getTimeSlot1();
  // wizard four closed

  // save into local storage start
  $scope.savelocallyDate = function(value) {
    if (getLocalStorageData()) {
      localData = getLocalStorageData();
    }
    localData.pickupDate = value;
    let obj = JSON.stringify(localData);
    saveLocalData(obj);
  };

  $scope.savelocallyTime = function(value) {
    // console.log(value);
    // localData.pickupTime = value;
    // var stringlocalTime = JSON.stringify(localData);
    // localStorage.setItem('Myorder',  stringlocalTime);
  };

  $scope.savelocallyDeliveryDate = function(value) {
    if (getLocalStorageData()) {
      localData = getLocalStorageData();
    }
    localData.deliveryDate = value;
    let obj = JSON.stringify(localData);
    saveLocalData(obj);
  };

  $scope.savelocallyDeliveryTime = function(value) {
    // console.log(value);
    // localData.deliveryTime = value;
    // var stringlocalTime = JSON.stringify(localData);
    // localStorage.setItem('Myorder',  stringlocalTime);
  };

  // forth wizard
  let myPayment;
  function getLocalDetail() {
    // let getItemLocally = getLocalStorageData();

    $scope.getLocalDetail = getLocalStorageData();

    getAddress();
    function getAddress() {
      $http
        .get(appInfo.url + "customersapi/view/?id=" + x + "&expand=addresses")
        .then(function(res) {
          console.log(res.data);
          $scope.getAddress = res.data;
        })
        .catch(function(err) {
          $scope.loading = false;
          console.log(err);
        });
    }

    getPayment();
    getVault(x);
    function getPayment() {
      console.log(
        appInfo.url + "customersapi/view/?id=" + x + "&expand=payments"
      );
      $http
        .get(appInfo.url + "customersapi/view/?id=" + x + "&expand=payments")
        .then(function(res) {
          console.log(res);
          $scope.getpayment = res.data.payments[0];
          myPayment = res.data.payments[0];
          if (!$scope.getpayment) {
            return;
          }
          getVault($scope.getpayment.vault_id);
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    function getVault(id) {
      $scope.loading = true;
      console.log(appInfo.url + "customersapi/view/?id=" + x + "&expand=vault");
      $http
        .get(appInfo.url + "customersapi/view/?id=" + x + "&expand=vault")
        .then(function(res) {
          $scope.loading = false;
          $scope.getpayment = res.data.vault[0];
          myPayment = res.data.vault[0];
        })
        .catch(function(err) {
          console.log("vault22");
          $scope.loading = false;
          console.log(err);
        });
    }
  }

  //get data in fith wizard
  $scope.createOrder = function() {
    if ($scope.getAddress.addresses.length == 0) {
      alert("Please add address");
      console.log("Please add address");
      return;
    }
    if (!myPayment) {
      alert("Please add payment");
      console.log("Please add payments");
      return;
    }

    let getItemLocallyCustomer = localStorage.getItem("laundryUser");
    var confuseDatepickup = $scope.getLocalDetail.pickupDate.date;
    var simpleDatepickup = new Date(confuseDatepickup)
      .toISOString()
      .substr(0, 10);
    var confuseDate = $scope.getLocalDetail.deliveryDate.date;
    var simpleDate = new Date(confuseDate).toISOString().substr(0, 10);

    let data = {
      payment_id: myPayment.id,
      status: "0",
      pickup_date: simpleDatepickup,
      pickup_time_from: $scope.getLocalDetail.pickupTime.time_from,
      pickup_time_to: $scope.getLocalDetail.pickupTime.time_to,
      pickup_price: $scope.getLocalDetail.pickupTime.price,
      pickup_type: $scope.getLocalDetail.pickupTime.type,
      drop_date: simpleDate,
      drop_time_from: $scope.getLocalDetail.deliveryTime.time_from,
      drop_time_to: $scope.getLocalDetail.deliveryTime.time_to,
      drop_price: $scope.getLocalDetail.deliveryTime.price,
      drop_type: $scope.getLocalDetail.deliveryTime.type,
      address_id: $scope.getAddress.addresses[0].id,
      same_day_pickup: "0",
      next_day_drop: "0",
      comments: "0",
      customer_id: getItemLocallyCustomer,
      pickup_at_door:
        $scope.getLocalDetail.pickupTime.leaveAtdoor == "y" ? 1 : 0,
      drop_at_door:
        $scope.getLocalDetail.deliveryTime.leaveAtdoor == "y" ? 1 : 0
    };

    for (let key in data) {
      if (!data[key]) {
        data[key] = "0";
      }
    }

    let req = {
      method: "POST",
      url: appInfo.url + "ordersapi/create",
      data: $httpParamSerializer(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.err = "";
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        removeLoalStorageAndGoToDashboard();
        console.log(res);
      })
      .catch(function(error) {
        $scope.loading = false;
        let err = error.data;
        console.log(error);
      });
  };
  // save onto local storage closed

  function removeLoalStorageAndGoToDashboard() {
    localStorage.removeItem("Myorder");
    $location.path("/dashboard");
  }
  $scope.onGoBack = function() {
    $(".modal").css("display", "block");
  };
  $scope.onCancelOrder = function() {
    $(".modal.cancel-order-modal").css("display", "block");
  };

  $("body").on("click", ".cancel-order-btn", function() {
    let modal = $(this).parents(".modal.cancel-order-modal")[0];
    modalClose(modal);
    localStorage.removeItem("Myorder");
    $scope.$apply(function() {
      $location.path("/dashboard");
    });
  });

  function saveLocalData(data) {
    localStorage.setItem("Myorder", data);
  }

  $("body").on("click", ".next", function() {
    if ($(this).parents(".tab1").length != 0) {
      functionForSecond();
      $(this)
        .parents(".tab1")
        .css("display", "none");
      $(this)
        .parents(".tab1")
        .siblings(".tab2")
        .css("display", "block");
    }

    if ($(this).parents(".tab2").length != 0) {
      let value = $('input[name="pickUpRadio"]:checked').val();
      let leaveVal = $('input[name="pickAtDoor"]:checked').val();
      if (value || leaveVal) {
        if (getLocalStorageData()) {
          localData = getLocalStorageData();
        }
        if (value) {
          let a = JSON.parse(value);
          localData.pickupTime = a;
        } else {
          localData.pickupTime.leaveAtdoor = "y";
        }
        let obj = JSON.stringify(localData);
        saveLocalData(obj);
        functionForThird();
        $(this)
          .parents(".tab2")
          .siblings(".tab1")
          .css("display", "none");
        $(this)
          .parents(".tab2")
          .css("display", "none");
        $(this)
          .parents(".tab2")
          .siblings(".tab3")
          .css("display", "block");
      } else {
        console.log("else pickup time !");
      }
      return;
    }

    if ($(this).parents(".tab3").length != 0) {
      functionForForth();
      $(this)
        .parents(".tab3")
        .siblings(".tab2")
        .css("display", "none");
      $(this)
        .parents(".tab3")
        .css("display", "none");
      $(this)
        .parents(".tab3")
        .siblings(".tab4")
        .css("display", "block");
    }

    if ($(this).parents(".tab4").length != 0) {
      let value = $('input[name="deliveryRadio"]:checked').val();
      let deliveryAtDoor = $('input[name="deliveryAtDoor"]:checked').val();

      if (value || deliveryAtDoor) {
        if (getLocalStorageData()) {
          localData = getLocalStorageData();
        }
        if (value) {
          let a = JSON.parse(value);
          localData.deliveryTime = a;
        } else {
          localData.deliveryTime.leaveAtdoor = "y";
        }
        let obj = JSON.stringify(localData);
        saveLocalData(obj);
        getLocalDetail();
        $(this)
          .parents(".tab4")
          .siblings(".tab3")
          .css("display", "none");
        $(this)
          .parents(".tab4")
          .css("display", "none");
        $(this)
          .parents(".tab4")
          .siblings(".tab5")
          .css("display", "block");
      } else {
        console.log("else pickup time !");
      }
    }
  });

  function test(key) {
    console.log("key", key);
    let localData = getLocalStorageData();
    localData[key] = {};
    let obj = JSON.stringify(localData);
    saveLocalData(obj);
  }

  $("body").on("click", ".close, .close-modal", function() {
    let modal = $(this)
      .parents("section")
      .find(".modal")[0];
    if (modal) {
      modalClose(modal);
    } else {
      modal = $(this).parents(".modal.cancel-order-modal")[0];
      modalClose(modal);
    }
  });

  window.onclick = function(event) {
    if (
      event.target.className == "modal" ||
      event.target.className == "modal cancel-order-modal"
    ) {
      modalClose(event.target);
    }
  };

  function modalShow(modal) {
    modal.style.display = "block";
    console.log("show", modal);
  }

  function modalClose(modal) {
    modal.style.display = "none";
    console.log("none", modal);
  }

  $("body").on("click", ".prev-modal, .prev-2-btn", function(e) {
    e.stopImmediatePropagation();
    console.log("hello", $(this));
    let modal = $(this)
      .parents("section")
      .find(".modal")[0];
    if ($(modal).is(":visible")) {
      modalClose(modal);
      prevFunction($(this));
    } else {
      modalShow(modal);
    }
  });

  function prevFunction(thisElement) {
    if (thisElement.parents(".tab2").length != 0) {
      test("pickupDate");
      functionForFirst();
      thisElement
        .parents(".tab2")
        .siblings(".tab1")
        .css("display", "block");
      thisElement.parents(".tab2").css("display", "none");
    }

    if (thisElement.parents(".tab3").length != 0) {
      test("pickupTime");
      functionForSecond();
      thisElement
        .parents(".tab3")
        .siblings(".tab2")
        .css("display", "block");
      thisElement.parents(".tab3").css("display", "none");
    }

    if (thisElement.parents(".tab4").length != 0) {
      test("deliveryDate");
      functionForThird();
      thisElement
        .parents(".tab4")
        .siblings(".tab3")
        .css("display", "block");
      thisElement.parents(".tab4").css("display", "none");
    }

    if (thisElement.parents(".tab5").length != 0) {
      test("deliveryTime");
      functionForForth();
      thisElement
        .parents(".tab5")
        .siblings(".tab4")
        .css("display", "block");
      thisElement.parents(".tab5").css("display", "none");
    }
  }

  $(".checky")
    .change(function() {
      //$(this).parents(".list").siblings(".finaldate1").toggleClass("fade", this.checked)
      $(".mybutton2").toggleClass("fade", this.checked);
    })
    .change();

  $(".checky").click(function() {
    if ($(this).is(":checked")) {
      $("#div_slots")
        .find("input[type=radio]")
        .prop("checked", false);
      $("#div_slots")
        .find("input[type=radio]")
        .attr("disabled", true);
    } else {
      $("#div_slots")
        .find("input[type=radio]")
        .attr("disabled", false);
    }
  });

  // $(".checky").each(function(){
  // 	if ($(this).prop('checked')==true){
  // 		alert("hello");
  // 	}
  // });
});

// Load Controller of PaymentmethodfCtrl

app.controller("PaymentmethodCtrl", function($scope, $http, appInfo) {
  $scope.loading = false;
  $scope.paymentId;
  let x = localStorage.getItem("laundryUser");
  $scope.userdata = {};
  $scope.paymentDetails = [];
  getPayment();

  $scope.onDeltePayment = function(data, i) {
    let id = $scope.userdata.payments[i].id;
    let req = {
      method: "DELETE",
      url: appInfo.url + "paymentsapi/delete?id=" + id,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.err = "";
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
        getPayment();
        console.log("tyahsee");
      })
      .catch(function(error) {
        $scope.loading = false;
        let err = error.data;
        $scope.err = err[0].message;
        // console.log(error);
      });
  };

  function getPayment() {
    $http
      .get(appInfo.url + "customersapi/view/?id=" + x + "&expand=payments")
      .then(function(res) {
        // console.log(res.data.payments[0].id);
        // $scope.paymentId = res.data.payments[0].id;

        $scope.userdata.payments = res.data.payments;
        if ($scope.userdata.payments.length == 0) {
          $scope.paymentDetails = [];
        }
        for (let value of $scope.userdata.payments) {
          getVault(value.vault_id);
        }
        console.log("tahsss");
      })
      .catch(function(err) {
        console.log(err);
      });

    $scope.editPayment = function(e) {
      console.log(e);
    };
  }

  function getVault(id) {
    $scope.loading = true;
    $http
      .get(appInfo.url + "vaultapi/view/?id=" + id)
      .then(function(res) {
        $scope.loading = false;
        // console.log(res.data);
        $scope.paymentDetails.push(res.data);
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  }
});

// Load Controller of FinaldateCtrl

app.controller("FinaldateCtrl", function($scope) {
  console.log("FinaldateCtrl");
});

// Load Controller of MyeditCtrl

app.controller("MyeditCtrl", function($scope, $routeParams) {
  $scope.message =
    "Clicked person name from home page should be dispalyed here";
  $scope.person = $routeParams.person;
  console.log($scope.person);

  $scope.persondata = [];

  $scope.myeditsave = function() {
    console.log($scope.persondata);
  };
});

// edit address
app.controller("EditAddressCtrl", function(
  $scope,
  appInfo,
  $routeParams,
  $http,
  $httpParamSerializer
) {
  $scope.loading = false;
  getOneAddress();
  getcity();
  $scope.addressData = {};
  $scope.cityData = {};

  $scope.change = function() {
    console.log("e");
  };

  $scope.onEditSubmit = function() {
    let data = {
      street_name: $scope.addressData.street_name,
      floor: $scope.addressData.floor,
      pobox: $scope.addressData.pobox,
      city_id: $scope.addressData.city_id
    };

    let req = {
      method: "PUT",
      url: appInfo.url + "addressesapi/update?id=" + $routeParams.id,
      data: $httpParamSerializer(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
        console.log("0");
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  };

  function getOneAddress() {
    $scope.loading = true;
    $http
      .get(appInfo.url + "addressesapi/view?id=" + $routeParams.id)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
        console.log("0");

        $scope.addressData = res.data;
        $scope.addressData.city_id = res.data.city_id.toString();
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  }

  function getcity() {
    $http
      .get(appInfo.url + "citiesapi")
      .then(function(res) {
        console.log(res.data);
        $scope.cityData = res.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

app.controller("EditPaymentCtrl", function(
  $scope,
  $http,
  appInfo,
  $routeParams,
  $httpParamSerializer
) {
  $scope.paymentDetails = {};
  getVault();

  $scope.onEditSubmit = function() {
    let data = {
      name: $scope.paymentDetails.name,
      number: $scope.paymentDetails.number,
      cvcode: $scope.paymentDetails.cvcode,
      expiry_month: $scope.paymentDetails.expiry_month,
      expiry_year: $scope.paymentDetails.expiry_year
    };

    let req = {
      method: "PUT",
      url: appInfo.url + "vaultapi/update?id=" + $routeParams.id,
      data: $httpParamSerializer(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  };

  function getVault(id) {
    $scope.loading = true;
    $http
      .get(appInfo.url + "vaultapi/view/?id=" + $routeParams.id)
      .then(function(res) {
        $scope.loading = false;
        // console.log(res.data);
        $scope.paymentDetails = res.data;
      })
      .catch(function(err) {
        $scope.loading = false;
        console.log(err);
      });
  }
});

app.controller("AddAddressCtrl", function(
  $scope,
  $http,
  appInfo,
  $httpParamSerializer
) {
  let x = localStorage.getItem("laundryUser");
  $scope.loading = false;
  $scope.addressData = {};
  $scope.cityData = [];
  getcity();
  $scope.err;
  $scope.onAddSubmit = function() {
    let data = {
      street_name: $scope.addressData.street_name,
      floor: $scope.addressData.floor,
      pobox: $scope.addressData.pobox,
      city_id: $scope.addressData.city_id,
      customer_id: x,
      unit_number: $scope.addressData.unit_number,
      as_default: "0"
    };
    let req = {
      method: "POST",
      url: appInfo.url + "addressesapi/create",
      data: $httpParamSerializer(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.err = "";
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
        console.log("add");
      })
      .catch(function(error) {
        $scope.loading = false;
        let err = error.data;
        $scope.err = err[0].message;
        // console.log(error);
      });
  };

  function getcity() {
    $http
      .get(appInfo.url + "citiesapi")
      .then(function(res) {
        // console.log(res.data);
        $scope.cityData = res.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

app.controller("AddPaymentCtrl", function(
  $scope,
  $http,
  appInfo,
  $httpParamSerializer
) {
  let userId = localStorage.getItem("laundryUser");
  $scope.paymentDetails = {};
  debugger;
  $scope.userId = userId;

  //todo:after every 20 milliseconds keep checking if the content of the iframe is
  //"completed" then rediect to mydetails page to the payments section

  // setInterval(function() {
  //alert($("#iframe2").contents().find("body").html());
  //}, 3000);

  //$('#submit').click();
  var doc = document.getElementById("iframe2").contentWindow.document;
  doc.open();
  doc.write(
    'Loading... \
	\
                <FORM ACTION="https://payment.architrade.com/paymentweb/start.action" METHOD="POST" CHARSET="UTF -8"> \
                  <INPUT TYPE="hidden" NAME="accepturl" VALUE="http://localhost/advanced/backend/web/vault/createvault"> \
                    <INPUT TYPE="hidden" NAME="cancelurl" VALUE="http://localhost/advanced/backend/web/vault/createvault"> \
                    <INPUT TYPE="hidden" NAME="callbackurl" VALUE=""> \
                  <INPUT TYPE="hidden" NAME="amount" VALUE="1"> \
                  <INPUT TYPE="hidden" NAME="currency" VALUE="578"> \
                  <INPUT TYPE="hidden" NAME="merchant" VALUE="90246240"> \
                  <INPUT TYPE="hidden"   NAME="orderid" id="orderid" VALUE="' +
      userId +
      '"> \
                  <INPUT TYPE="hidden" NAME="lang" VALUE="EN"> \
                  <INPUT TYPE="hidden" NAME="preauth" VALUE="1"> \
                  <INPUT TYPE="hidden" NAME="test" VALUE="1"> \
                  <INPUT TYPE="hidden" NAME="decorator" VALUE="responsive" /> \
                  <INPUT type="Submit" id="submit" name="submit" style="visibility:hidden"  value="TICKET DEMO"> \
                  </FORM> \
                  <script src="js/jquery-3.3.1.slim.min.js"></script> \
                  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> \
				  <script>$("#submit").click();</script>\
                  '
  );
  doc.close();

  $scope.onAddPayment = function() {
    debugger;
    let data = {
      name: $scope.paymentDetails.name,
      number: $scope.paymentDetails.number,
      cvcode: $scope.paymentDetails.cvcode,
      expiry_month: $scope.paymentDetails.expiry_month,
      expiry_year: $scope.paymentDetails.expiry_year
    };

    let req = {
      method: "POST",
      url: appInfo.url + "vaultapi/create",
      data: $httpParamSerializer(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.err = "";
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
        addPayment(res.data.id);
      })
      .catch(function(error) {
        $scope.loading = false;
        let err = error.data;
        $scope.err = err[0].message;
        // console.log(error);
      });
  };

  function addPayment(id) {
    let data = {
      customer_id: userId,
      vault_id: id
    };

    let req = {
      method: "POST",
      url: appInfo.url + "paymentsapi/create",
      data: $httpParamSerializer(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $scope.err = "";
    $scope.loading = true;
    $http(req)
      .then(function(res) {
        $scope.loading = false;
        console.log(res.data);
        $scope.paymentDetails = {};
      })
      .catch(function(error) {
        $scope.loading = false;
        let err = error.data;
        $scope.err = err[0].message;
        // console.log(error);
      });
  }
});


app.controller("PaymentSuccessCtrl", function(
  $scope,
  $routeParams,
  $http,
  appInfo,
  $httpParamSerializer,
  $location
) {

  $(".navbar-fixed").show();
  $(".sidenav").sidenav("close");

  $(document).ready(function() {
    $(".modal").modal();
  });

  //  localstorage keys
  var id = $routeParams.id;
  var type = $routeParams.type;
  
});

app.controller("PaymentErrorCtrl", function(
  $scope,
  $routeParams,
  $http,
  appInfo,
  $httpParamSerializer,
  $location
) {

  $(".navbar-fixed").show();
  $(".sidenav").sidenav("close");

  $(document).ready(function() {
    $(".modal").modal();
  });
  //  localstorage keys
  var id = $routeParams.id;
  var type = $routeParams.type;
  
});