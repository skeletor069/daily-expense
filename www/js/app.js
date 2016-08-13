// Ionic Starter App

var db = null;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("expense.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("expense.db", "1.0", "My expense", -1);
    }
    //$cordovaSQLite.execute(db, "drop table if exists categories");
    $cordovaSQLite.execute(db, "create table if not exists categories(id integer primary key, category_name text,icon_name text)");
    $cordovaSQLite.execute(db, "create table if not exists expense(id integer primary key, category_id integer, cost real, date numeric, note text)");
    //$cordovaSQLite.execute(db, "insert into categories(category_name, icon_name) values(?,?)",["Transport","blank"]);
    $cordovaSQLite.execute(db,"select id from categories",[]).then(
      function(res){
        if(res.rows.length == 0){
          $cordovaSQLite.execute(db, "insert into categories(category_name, icon_name) values(?,?)",["Transport","Blank"]);
          $cordovaSQLite.execute(db, "insert into categories(category_name, icon_name) values(?,?)",["Food","Blank"]);
          $cordovaSQLite.execute(db, "insert into categories(category_name, icon_name) values(?,?)",["Household","Blank"]);
          $cordovaSQLite.execute(db, "insert into categories(category_name, icon_name) values(?,?)",["Bills","Blank"]);
          $cordovaSQLite.execute(db, "insert into categories(category_name, icon_name) values(?,?)",["Shopping","Blank"]);
          $cordovaSQLite.execute(db, "insert into categories(category_name, icon_name) values(?,?)",["Grocery","Blank"]);
          $cordovaSQLite.execute(db, "insert into categories(category_name, icon_name) values(?,?)",["Telephone","Blank"]);
          $cordovaSQLite.execute(db, "insert into categories(category_name, icon_name) values(?,?)",["Car","Blank"]);
        }
      }, function(err){
        console.log(err);
      }
    );
  });
})
