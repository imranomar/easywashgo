// App Controller
app.controller('AppController', function ($scope, $rootScope, $location, CommonService) {
	$rootScope.showLoading = false;

	$rootScope.goTo = function(route)
	{
		$('.sidenav').sidenav('close');
		$location.path(route);
	}

	$scope.signout = function()
	{
		CommonService.removeUserDetailsLocal();
		$rootScope.goTo('/login');
	}

  $scope.closemenu = function ()
  {
    $location.path("/dashboard");
    console.log("MenuCtrl");
  }
});

//Login of Controller
app.controller('LoginCtrl', function($scope, $rootScope, $location, $timeout, CommonService){
	$rootScope.showLoading = false;

 	$scope.logindata = {
		email: '',
		password: ''
	};

	$scope.checked = true;

 	$scope.err = false;

	$scope.loginsubmit = function () {
		$scope.err = false;
		
		let email= $scope.logindata.email;
		let password= $scope.logindata.password;

		$rootScope.showLoading = true;

		var apiUrl = 'customersapi/authenticate?email='+email+'&password='+password;
		
		CommonService.CallAjaxUsingPostRequest(apiUrl, { device_id: $rootScope.fcm_token })
          .then(
            function(data) {
				if(data != 0) {
					debugger;
					CommonService.storeUserDetailsLocal(data, $scope.checked)
					$location.path('/dashboard');
				} else {
					$scope.err = true;
				}
            },
            function(error) {
				console.log("error");
				console.log(err);
			}
          )
          .finally(function() {
            $rootScope.showLoading = false;
          });
	}
	
	/** Validation **/
	$scope.validationOptions = {
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true
			}
		}
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
  $filter,
  $http,
  appInfo,
  $httpParamSerializer
) {

  $scope.filterIndex = -1;

  $scope.currentDate = new Date();
  $scope.date = new Date();
  
  $scope.filters = ["9-12", "12-15", "15-18", "18-21"];

  $scope.all_tasks_list = [];
  $scope.tasks_list = [];
  $scope.filtered_tasks_list = [];

  $scope.err = "";
  $scope.loading = true;

  $scope.avaliableTime;


  $http
    .get(appInfo.url + "tasksapi?expand=order,address,customer")
    .then(function(res) {
      console.log(res.data);
      $scope.all_tasks_list = res.data;
      $scope.FilterTaskByDateList();
    })
    .catch(function(err) {
      console.log(err);
    });

    
  $scope.FilterTaskByDateList = function() {
    var filteredDate = $filter('date')($scope.date, "yyyy-MM-dd");

    $scope.tasks_list = $scope.all_tasks_list.filter(function(task) {      
      if (task.type == 1) {
        return task.order.pickup_date == filteredDate;
      } else {
        return task.order.drop_date == filteredDate;
      }
    });

    $scope.FilterTaskByHour();
  }

  $scope.FilterTaskByHour = function() {
    var currentHour = $scope.date.getHours();

    var index = $scope.filters.findIndex(function(item) {
      var arr = item.split("-");
      return currentHour >= parseInt(arr[0]) && currentHour <= parseInt(arr[1]);
    });

    $scope.FilterTaskList(index);
  };


  $scope.FilterTaskList = function(filterIndex) {
    $scope.filterIndex = filterIndex;

    if(filterIndex == -1) {
      $scope.filtered_tasks_list = $scope.tasks_list;
    } else {
      var hours = $scope.filters[filterIndex].split("-");

      $scope.filtered_tasks_list = $scope.tasks_list.filter(function(task) {
        var order = task.order;
        if (task.type == 1) {
          return (
            order.pickup_time_from == parseInt(hours[0]) &&
            order.pickup_time_to == parseInt(hours[1])
          );
        } else {
          return (
            order.drop_time_from == parseInt(hours[0]) &&
            order.drop_time_to == parseInt(hours[1])
          );
        }
      });
    }
  };

  $scope.showPreviousDayTask = function() {
    $scope.date.setDate($scope.date.getDate() - 1);

    $scope.FilterTaskByDateList();
  }

  $scope.goToTaday = function() {
    $scope.date = new Date();
    $scope.FilterTaskByDateList();
  }

  $scope.showNextDayTask = function() {
    $scope.date.setDate($scope.date.getDate() + 1);

    $scope.FilterTaskByDateList();
  }

  $scope.menuopen = function() {
    //$location.path("/menu");
  };

  $scope.closemenu = function() {
    angular.element(".Menu").remove();
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
// Load Controller of DeliverydateCtrl

app.controller("DeliverydateCtrl", function($scope) {
  // body...
});

app.controller("TaskDetailsCtrl", function(
  $scope,
  $rootScope,
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

  //get task details
  $http
    .get(
      appInfo.url +
        "tasksapi/view/?id=" +
        task_id +
        "&expand=order,address,customer,vault"
    )
    .then(function(res) {
      console.log(res.data);
      $scope.task = res.data;
      $scope.vault_details = $scope.task.vault;

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
      }).map(function(item) {
        var order_item = {};
        order_item.order_id = $scope.task.order_id;
        order_item.title = item.title;
        order_item.type = item.type;
        order_item.quantity = item.items_count;
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
            order.status = $rootScope.Constant.ORDER_STATUS.PICKED_UP;

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
                  
                  $scope.changeTaskStatus();

                  // $('.modal-close').trigger('click');
                  // alert("Pickup closed successfully");
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

    $scope.changeTaskStatus = function() {
      var task = {};
      task.id = $scope.task.id;
      task.order_id = $scope.task.order_id;
      task.type = $scope.task.type;
      task.at = $scope.closetaskdetails.at;
      task.status = $rootScope.Constant.TASK_STATUS.CLOSE;
      
      let req = {
        method: "PUT",
        url: appInfo.url + "tasksapi/update/?id="+ $scope.task.id,
        data: $httpParamSerializer(task),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };

      $http(req)
      .then(function(res) {
          $scope.popupLoading = false;
          console.log(res.data);
        
          alert("Pickup closed successfully");
          $location.path("/dashboard");
      }).catch(function(error) {
        console.log(error);
        alert("Error while closing pickup");
        $scope.popupLoading = false;
      });
    }

    $scope.openModal = function(modalId) {
      $scope.paymentSubmitted = false;
      $('#'+modalId).modal('open');
    }

    $scope.getTotalAmount = function(orderText)
    {
      var totalAmount = 0;
      var order_text = '';
      var amount = 0

      if($scope.task.order.same_day_pickup == 1 && ($scope.appoptions && $scope.appoptions.same_day_pickup_price))
      {
        amount = parseFloat($scope.appoptions.same_day_pickup_price);
        totalAmount += amount;
        order_text += 'Same Day Pickup: ' + amount; 
      }

      if($scope.task.order.pickup_price && $scope.task.order.pickup_price != '0')
      {
        amount = parseFloat($scope.task.order.pickup_price);
        totalAmount += amount;

        order_text += (order_text == ''?'': ', ') + 'Fixed time pickup: ' + amount;
      }

      if($scope.task.order.next_day_drop == 1 && ($scope.appoptions && $scope.appoptions.next_day_delivery_price))
      {
        amount = parseFloat($scope.appoptions.next_day_delivery_price);
        totalAmount += amount;

        order_text += (order_text == ''?'': ', ') + 'Next day delivery: ' + amount;
      }

      if($scope.task.order.drop_price && $scope.task.order.drop_price)
      {
        amount = parseFloat($scope.task.order.drop_price);
        totalAmount += amount;

        order_text += (order_text == ''?'': ', ') + 'Fixed time delivery: ' + amount;
      }

      order_text += order_text == ''?'': ' | ';

      order_text += 'Items: ';
      
      angular.forEach($scope.order_items, function(value, key)
      {
        totalAmount += parseFloat(value.price);
        order_text += (key == 0?"":", ") + value.quantity + "-" + value.title;
      });

      order_text += order_text == ''?'': ' | ';
      
      order_text += "Total: " + totalAmount;

      if(orderText && orderText == true)
        return order_text;
      else
        return totalAmount
    }

    $scope.paymentSubmitted = false;
    $scope.makePayment = function() 
    {
      $scope.paymentSubmitted = true;
      $scope.task.order.status = 2;
      var total_amount = $scope.getTotalAmount();
      var order_text = $scope.getTotalAmount(true);

      var doc = document.getElementById("paymentForm").contentWindow.document;

      var html = '';
      html += '<style>html{ overflow: hidden; } </style>';
      html += '<div class="payment-loader">';
      html += '<h1> Please wait </h1>';
      html += '</div>';
      html += '<form action="https://payment.architrade.com/cgi-ssl/ticket_auth.cgi" method="post">';
      html += '<input type="hidden" name="merchant" value="90246240" />';
      html += '<input type="hidden" name="ticket" value="'+ $scope.vault_details.transact + '" />';
      html += '<input type="hidden" name="amount" value="'+ total_amount + '" />';
      html += '<input type="hidden" name="currency" value="578" />';
      html += '<input type="hidden" name="orderid" value="'+ $scope.task.order_id +'" />';
      html += '<input type="hidden" name="preauth" value="1" />';
      html += '<input type="hidden" name="test" value="1" />';
      html += '<input type="hidden" name="ordertext" value="'+ order_text +'" />';
      html += '<input type="hidden" name="accepturl" value="http://localhost/advanced/backend/web/order/paymentcallback" />';
      html += '<input type="hidden" name="declineurl" value="http://localhost/advanced/backend/web/order/paymentcallback" />';
      html += '<INPUT type="submit" id="submit" name="submit" style="visibility:hidden"  value="TICKET DEMO"> ';
      html += '</form>';
      html += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
      html += '<script>$("#submit").click();</script>';
      console.log(html);
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


app.controller("PaymentSuccessCtrl", function(
  $scope,
  $routeParams,
  $http,
  appInfo,
  $httpParamSerializer,
  $location
) {

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

  $(document).ready(function() {
    $(".modal").modal();
  });
  //  localstorage keys
  var id = $routeParams.id;
  var type = $routeParams.type;
  
});