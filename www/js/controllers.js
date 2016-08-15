angular.module('app.controllers', [])

.controller('homeCtrl', ['$scope', '$stateParams','$cordovaSQLite', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaSQLite) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  $scope.$on("$ionicView.enter", function(event, data){
    $scope.transactions = [];
    var today = new Date();
    $scope.displayMonth = today.getMonth();
    $scope.displayYear = today.getFullYear();
    $scope.displayTotal = 0;
    $scope.displayMonthName = monthNames[$scope.displayMonth];
    PopulateTransactions();

  });

  $scope.GetCategoryTitle = function(cat){
    return cat.charAt(0).toUpperCase();
  }

  $scope.NextMonth = function(){
    $scope.displayMonth++;
    if($scope.displayMonth == 12)
    {
      $scope.displayYear++;
      $scope.displayMonth = 0;
    }
    $scope.displayMonthName = monthNames[$scope.displayMonth];
    PopulateTransactions();
  };

  $scope.PreviousMonth = function(){
    $scope.displayMonth--;
    if($scope.displayMonth == -1)
    {
      $scope.displayYear--;
      $scope.displayMonth = 11;
    }
    $scope.displayMonthName = monthNames[$scope.displayMonth];
    PopulateTransactions();
  }

  function PopulateTransactions(){
    var query = "select E.*,C.category_name from expense E,categories C where E.category_id=C.id and E.year=? and E.month=? order by year,month,day,id desc";
    $cordovaSQLite.execute(db, query, [$scope.displayYear,$scope.displayMonth]).then(
      function(res){
        var trxnList = [];
        var totalCost = 0;

        if(res.rows.length > 0){
          for(var i = 0 ; i < res.rows.length; i++){
            var temp = new Date(res.rows.item(i).date);
            var trxn = {
              id : res.rows.item(i).id,
              cost : res.rows.item(i).cost,
              year : res.rows.item(i).year,
              month : res.rows.item(i).month,
              cat_id : res.rows.item(i).category_id,
              cat_name :  res.rows.item(i).category_name,
              display_note : (res.rows.item(i).note == "") ? res.rows.item(i).category_name : res.rows.item(i).note,
              display_date : temp.toDateString()
            };
            totalCost += res.rows.item(i).cost;
            trxnList.push(trxn);
          }

        }
        $scope.transactions = trxnList;
        $scope.displayTotal = totalCost;
      },
      function(err){
        console.log(err);
      }
    );
  }

}])

.controller('categoriesCtrl', ['$scope', '$stateParams','Categories','$ionicHistory','TrxnService','$cordovaSQLite',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Categories, $ionicHistory, TrxnService, $cordovaSQLite) {
  $scope.categories = [];
  //GetCategories();
  PopulateCategories();

  function PopulateCategories(){
    var query = "select id,category_name from categories";
    $cordovaSQLite.execute(db, query, []).then(function(res){
      if(res.rows.length > 0){
        for(var i = 0 ; i < res.rows.length; i++){
          var item = {
            id : res.rows.item(i).id,
            cat_name : res.rows.item(i).category_name
          }
          $scope.categories.push(item);
        }
      }
    }, function(err){
      console.log(err);
    });
  }

  $scope.CategorySelected = function(cat_id){
    TrxnService.setCategory(cat_id);
    $ionicHistory.goBack();
  }

  function GetCategories(){
    Categories.all().then(function(categories){
      $scope.categories = categories;
    });
  }

}])

.controller('addNewCategoryCtrl', ['$scope', '$stateParams', 'Categories','$cordovaSQLite',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,Categories, $cordovaSQLite) {

  $scope.category_name = "";

  $scope.SaveNewItem = function(cat_nm){
    //Categories.add({category_name: cat_nm});
    if(cat_nm != "") {
      var query = "insert into categories(category_name, icon_name) values(?,?)";

      $cordovaSQLite.execute(db, query, [cat_nm, 'blank']).then(
        function (res) {
          console.log(res.insertId)
        },
        function (err) {
          console.log(err);
        }
      );
    }
  }

}])

.controller('enterExpenseCtrl', ['$scope', '$stateParams', '$ionicHistory','TrxnService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicHistory, TrxnService) {

  $scope.equation = "";
  $scope.total = 0;
  $scope.lastInsertOperator = false;

  $scope.NumberClicked = function(number){
    $scope.equation += number;
    $scope.lastInsertOperator = false;
  };

  $scope.OperatorClicked = function(sign){
    if(!$scope.lastInsertOperator)
      $scope.equation += sign;
    else{
      $scope.equation = $scope.equation.slice(0,-1) + sign;
    }
    $scope.lastInsertOperator = true;
  };

  $scope.BackspaceClicked = function(){
    $scope.equation = $scope.equation.slice(0,-1);
    var last = $scope.equation.charAt($scope.equation.length-1);
    if(last == "+" || last == "-" || last == "X" || last == "/")
      $scope.lastInsertOperator = true;
    else
      $scope.lastInsertOperator = false;
  };

  $scope.ResultClicked = function(){
    if($scope.equation == "") {
      TrxnService.setCost($scope.total);
      $ionicHistory.goBack();
      return;
    }
    if($scope.lastInsertOperator)
      $scope.equation = $scope.equation.slice(0,-1);
    $scope.total = eval($scope.equation);
    $scope.equation = "";
  };

}])

.controller('addTransactionCtrl', ['$scope', '$stateParams','TrxnService','$cordovaSQLite','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, TrxnService, $cordovaSQLite, $state) {

  $scope.$on("$ionicView.enter", function(event, data){
    $scope.cost = TrxnService.getCost();
    $scope.cat_id = TrxnService.getCategory();
    $scope.note = TrxnService.getNote();
    $scope.date = TrxnService.getEntryDate();
    $scope.selectedCategory = "";
    SetCategoryNameById();

  });

  $scope.SaveTransaction = function(cat_id,cst, dt,nt){

    if(cst > 0){

      var query = "insert into expense(category_id,cost,date,note, day, month, year) values(?,?,?,?,?,?,?)";

      $cordovaSQLite.execute(db, query,[cat_id, cst, dt, nt, dt.getDate(), dt.getMonth(), dt.getFullYear()]).then(
        function(res){
          TrxnService.Reset();
          $state.go('menu.home',{},{reload:true});
        },
        function(err){
          console.log(err);
        }
      );
    }
  };

  $scope.Cancel = function(){
    TrxnService.Reset();
  }



  $scope.UpdateNote = function(note){
    TrxnService.setNote(note);
  };

  $scope.UpdateDate = function(date){
    TrxnService.setEntryDate(date);
  };

  function SetCategoryNameById(){
    var query = "select category_name from categories where id=?";

    $cordovaSQLite.execute(db, query, [$scope.cat_id]).then(
      function(res){
        if(res.rows.length > 0)
          $scope.selectedCategory = res.rows.item(0).category_name;
      },
      function(err){
        console.log(err);
      }
    );
  }
}])

.controller('reportCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
