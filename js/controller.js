var editTodo  = function(i, li, edit, filter) {
  return function() {
    var text = edit.getText();
    // Only add non-empty tasks, note that trim() is not supported
    // by IE <= 8 but since this is an TodoMVC app, that is okay
    var trimmedText = text.trim();
    if(trimmedText !== "") {
      todos.get(i).value = trimmedText;
      window.nc.postNotification("refresh", filter);
    } else {
      todos.remove(i);
      window.nc.postNotification("refresh", filter);
    }
  };
};

var deleteTodo = function(index, filter) {
  // The return statement is put here in order to create a new referncing
  //
  // enviroment for in this closure
  return function() {
    todos.remove(index);
    window.nc.postNotification("refresh", filter);
  };
};

var toggleAllTodos = function(filter) {
  return function() {
    if(todos.allTasksCompleted())
      todos.setAllCompleted(false);
    else
      todos.setAllCompleted(true);
    window.nc.postNotification("refresh", filter);
  };
};

var addTodo = function(input, filter) {
  // Only add non-empty tasks, note that trim() is not supported
  // by IE <= 8 but since this is an TodoMVC app, that is okay
  var trimmedText = input.trim();
  if(trimmedText !== "") {
    todos.add(trimmedText);
    window.nc.postNotification("refresh", filter);
  }
};

var toggleTodo = function(currentTodo, filter) {
  // The return statement is put here in order to create a new referncing
  // enviroment for in this closure
  return function() {
    if(currentTodo.completed) {
      currentTodo.completed = false;
    } else {
      currentTodo.completed = true;
    }
    window.nc.postNotification("refresh", filter);
  };
};

var clearCompletedTodos = function(filter) {
  return function() {
    todos.clearCompleted();
    window.nc.postNotification("refresh", filter);
  };
};

