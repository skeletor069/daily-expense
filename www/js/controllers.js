angular.module('app.controllers', [])

.controller('homeCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('categoriesCtrl', ['$scope', '$stateParams', '$cordovaSQLite','$ionicHistory','TrxnService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaSQLite, $ionicHistory, TrxnService) {
  $scope.categories = GetCategories();

  $scope.CategorySelected = function(cat_id){
    TrxnService.setCategory(cat_id);
    $ionicHistory.goBack();
  }

  function GetCategories(){
    var items = [];
    var query = "select id,category_name from categories";
    $cordovaSQLite.execute(db,query, []).then(function(res){
      if(res.rows.length > 0) {
        //console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
        for(var i = 0 ; i < res.rows.item.length; i++){
          var item = {
            id : res.rows.item[i].id,
            name : res.rows.item[i].category_name
          };
          items.push(item);
        }
        return items;
      }
    }, function(err){});

  }

}])

.controller('addNewCategoryCtrl', ['$scope', '$stateParams','$cordovaSQLite', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaSQLite) {
  $scope.newCategoryName = "";
  $scope.SaveNewCategory = function(){
    if($scope.newCategoryName != ""){
      var query = "inster into categories(category_name, icon_name) values(?,?)";
      $cordovaSQLite.execute(db, query, [$scope.newCategoryName, "blank"]).then(function(result){
        console.log("insert id " + result.insertId);
      });
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

.controller('addTransactionCtrl', ['$scope', '$stateParams','TrxnService','$cordovaSQLite', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, TrxnService, $cordovaSQLite) {
  $scope.cost = TrxnService.getCost();
  $scope.cat_id = TrxnService.getCategory();
  $scope.note = TrxnService.getNote();
  $scope.date = TrxnService.getEntryDate();

  $scope.UpdateNote = function(note){
    TrxnService.setNote(note);
  };

  $scope.UpdateDate = function(date){
    TrxnService.setEntryDate(date);
  };

  $scope.GetCategoryNameById = function(id){
    var query = "select category_name from categories where id=?";
    $cordovaSQLite.execute(db, query, [id]).then(
      function(res){
        if(res.rows.length > 0)
          return res.rows.item[0].category_name;
      },
      function(err){

      }
    );
  }
}])

.controller('reportCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
