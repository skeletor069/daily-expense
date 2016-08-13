angular.module('app.services', [])

  .factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
    var self = this;

    // Handle query's and potential errors
    self.query = function (query, parameters) {
      parameters = parameters || [];
      var q = $q.defer();

      $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, query, parameters)
          .then(function (result) {
            q.resolve(result);
          }, function (error) {
            console.warn('I found an error');
            console.warn(error);
            q.reject(error);
          });
      });
      return q.promise;
    };

    // Proces a result set
    self.getAll = function(result) {
      var output = [];

      for (var i = 0; i < result.rows.length; i++) {
        output.push(result.rows.item(i));
      }
      return output;
    };

    // Proces a single result
    self.getById = function(result) {
      var output = null;
      output = angular.copy(result.rows.item(0));
      return output;
    };

    return self;
  })

  .factory('Categories', [function($cordovaSQLite, DBA){
    var self = this;

    self.all = function() {
      return DBA.query("SELECT id, category_name FROM categories")
        .then(function(result){
          return DBA.getAll(result);
        });
    }

    self.get = function(memberId) {
      var parameters = [memberId];
      return DBA.query("SELECT id, category_name FROM categories WHERE id = (?)", parameters)
        .then(function(result) {
          return DBA.getById(result);
        });
    }

    self.add = function(member) {
      var parameters = [member.category_name, "blank"];
      return DBA.query("INSERT INTO categories (category_name, icon_name) VALUES (?,?)", parameters);
    }

    self.remove = function(member) {
      var parameters = [member.id];
      return DBA.query("DELETE FROM categories WHERE id = (?)", parameters);
    }

    self.update = function(origMember, editMember) {
      var parameters = [editMember.id, editMember.category_name, origMember.id];
      return DBA.query("UPDATE categories SET id = (?), category_name = (?) WHERE id = (?)", parameters);
    }

    return self;
  }])
.service('TrxnService', [function(){
    var cost = 0;
    var category = 1;
    var entryDate =new Date();
    var note = "";
    function getCost(){
      return cost;
    }

    function setCost(newCost){
      cost = newCost;
    }

    function getCategory(){
      return category;
    }

    function setCategory(newCategory){
      category = newCategory;
    }

    function getEntryDate(){
      return entryDate;
    }

    function setEntryDate(newEntryDate){
      entryDate = newEntryDate;
    }

    function getNote(){
      return note;
    }

    function setNote(newNote){
      note = newNote;
    }

    function Reset(){
      cost = 0;
      category = 1;
      entryDate =new Date();
      note = "";
    }

  return  {
    getCost : getCost,
    setCost : setCost,
    getCategory : getCategory,
    setCategory : setCategory,
    getEntryDate : getEntryDate,
    setEntryDate : setEntryDate,
    getNote : getNote,
    setNote : setNote,
    Reset : Reset

  }
}]);
