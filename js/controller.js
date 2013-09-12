var editTodo  = function(i, li, edit) {
  return function() {
    var text = edit.getText();
    // Only add non-empty tasks, note that trim() is not supported
    // by IE <= 8 but since this is an TodoMVC app, that is okay
    var trimmedText = text.trim();
    if (trimmedText !== "") {
      todos.get(i).value = trimmedText;
      window.nc.postNotification("refresh");
    } else {
      todos.remove(i);
      window.nc.postNotification("refresh");
    }
  };
};

var deleteTodo = function(index) {
  // The return statement is put here in order to create a new referncing
  //
  // enviroment for in this closure
  return function() {
    todos.remove(index);
    window.nc.postNotification("refresh");
  };
};

var toggleAllTodos = function() {
  return function() {
    if (todos.allTasksCompleted())
      todos.setAllCompleted(false);
    else
      todos.setAllCompleted(true);
    window.nc.postNotification("refresh");
  };
};

var addTodo = function(input) {
  // Only add non-empty tasks, note that trim() is not supported
  // by IE <= 8 but since this is an TodoMVC app, that is okay
  var trimmedText = input.trim();
  if (trimmedText !== "") {
    todos.add(trimmedText);
    window.nc.postNotification("refresh");
  }
};

var toggleTodo = function(currentTodo) {
  // The return statement is put here in order to create a new referncing
  // enviroment for in this closure
  return function() {
    if (currentTodo.completed) {
      currentTodo.completed = false;
    } else {
      currentTodo.completed = true;
    }
    window.nc.postNotification("refresh");
  };
};

var clearCompletedTodos = function() {
  return function() {
    todos.clearCompleted();
    window.nc.postNotification("refresh");
  };
};

