var TodoList = Class.extend({
  init: function() {
    this.todos = storage.retrieve();
  },
  add: function(todo) {
    this.todos.push({
      id: this.uuid(),
      value: todo,
      completed: false});
  },
  // Random (unique) uid, code stolen from TodoMVC jQuery impl.
  uuid: function () {
    /*jshint bitwise:false */
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  },
  get: function(id) {
    return this.todos[id];
  },
  remove: function(id) {
    this.todos.splice(id,1);
  },
  // Clear all completed todos, notice that filter only works for IE9+
  clearCompleted: function() {
    this.todos = this.todos.filter(function(todo) {
      return !todo.completed;
    });
  },
  size: function() {
    return this.todos.length;
  },
  // Use reduce count the completed todos, this only works in IE9+
  amountCompleted: function() { // The function will be called the number of times as the array is 
    // big and the prev will be appended by one if the todo is completed

    return this.todos.reduce(function(prev, curr) {
      if (curr.completed)
        return prev+1;
      else
        return prev;
    },0);
  },
  amountNotCompleted: function() {
    return this.todos.length - this.amountCompleted();
  },
  setAllCompleted: function(completed) {
    for(var i=0; i<this.todos.length; i++) {
      this.todos[i].completed = completed;
    }
  },
  allTasksCompleted: function() {
    if (this.amountNotCompleted() === 0)
      return true;
    else 
      return false;
  },
  getData: function() {
    return this.todos;
  }
});

var todos = new TodoList();

