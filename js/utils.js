var ENTER_KEY = 13;
var DB_NAME = "todos-ocean";

var Storage = Class.extend({
  init: function() {
    window.nc.addListener("refresh", function(filter) {
      storage.store(todos.getData());
    });
  },
  store: function(data) {
    localStorage[DB_NAME] = JSON.stringify(data);
  },
  retrieve: function() {
    var store = localStorage[DB_NAME];
    return (store && JSON.parse(store)) || [];
  }
});

var storage = new Storage();
