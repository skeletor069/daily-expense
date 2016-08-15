angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('menu.home', {
    url: '/page1',
      cache: false,
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    },
    params:{
      cat_id: 1,
      cost: 0
    }
  })

  .state('menu.categories', {
    cache: false,
    url: '/category',
    views: {
      'side-menu21': {
        templateUrl: 'templates/categories.html',
        controller: 'categoriesCtrl'
      }
    }

  })

  .state('menu.addNewCategory', {
    url: '/page6',
    views: {
      'side-menu21': {
        templateUrl: 'templates/addNewCategory.html',
        controller: 'addNewCategoryCtrl'
      }
    }
  })

  .state('menu.enterExpense', {
    url: '/calculator',
    views: {
      'side-menu21': {
        templateUrl: 'templates/enterExpense.html',
        controller: 'enterExpenseCtrl'
      }
    }

  })

  .state('menu.addTransaction', {
    cache : false,
    url: '/page2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/addTransaction.html',
        controller: 'addTransactionCtrl'
      }
    }

  })

  .state('menu.report', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/report.html',
        controller: 'reportCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/side-menu21/page1')



});
