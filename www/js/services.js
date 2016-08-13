angular.module('app.services', [])

.factory('BlankFactory', [function(){

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
