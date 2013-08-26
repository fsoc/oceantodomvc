var ENTER_KEY = 13;
var Todo = Class.extend({
  init: function(value) {
    this.value = value;
    this.completed = false;
  },
  isCompleted: function() {
    return this.completed;
  },
  toggleCompleted: function() {
    if(this.completed) {
      this.completed = false;
    } else {
      this.completed = true;
    }
    window.nc.postNotification("refresh", null);
  },
  setCompleted: function(completed) {
    this.completed = completed;
  },
  getValue: function() {
    return this.value;
  },
  setValue: function(data) {
    this.value = data;
  }
});

var TodoList = Class.extend({
  init: function() {
    this.todos = [];
  },
  add: function(todo) {
    this.todos.push(todo);
    window.nc.postNotification("refresh", null);
  },
  get: function(id) {
    return this.todos[id];
  },
  remove: function(id) {
    this.todos.splice(id,1);
    window.nc.postNotification("refresh", null);
  },
  // Clear all completed todos, notice that filter only works for IE9+
  clearCompleted: function() {
    this.todos = this.todos.filter(function(todo) {
      return !todo.isCompleted();
    });
    window.nc.postNotification("refresh", null);
  },
  size: function() {
    return this.todos.length;
  },
  // Use reduce count the completed todos, this only works in IE9+
  amountCompleted: function() { // The function will be called the number of times as the array is 
    // big and the prev will be appended by one if the todo is completed
    return this.todos.reduce(function(prev, curr) {
      if(curr.isCompleted())
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
      this.todos[i].setCompleted(completed);
    }
    window.nc.postNotification("refresh", null);
  },
  allTasksCompleted: function() {
    if(this.amountCompleted() === 0)
      return true;
    else 
      return false;
   }
});

var todos = new TodoList();
// The toggle-all button is not marked as completed


// The main reason to extend FocusWidget is to use a special eventListener
// for the Enter keys.
var InputBox = FocusWidget.extend({
  init: function() {
    // This function exists because createInputElement contains
    // deprecated jQuery code.
    this._super(html.input());
    this.sinkEvents(Event.ONKEYPRESS|Event.FOCUSEVENTS);
    this.value = this.getElement().value;
  },
  addEnterListener: function(listener) {
    this.enterListener = listener;
    return this;
  },
  addOnBlurListener: function(listener) {
    this.onBlurListener = listener;
    return this;
  },
  onBrowserEvent: function(event) {
    // Only listen on keypresses with ENTER
    if (event.type === "keypress" && event.which === ENTER_KEY) {
      if (this.enterListener) {
        this.enterListener(this, event);
      }
    } else if (event.type === "blur") {
      if (this.onBlurListener)
        this.onBlurListener(this, event);
    }
  },
  getText:function() {
    return DOM.getAttribute(this.getElement(),"value");
  },
  setText:function(text) {
    this.setAttr("value",text);
  },
  // Clear all input text data
  clear: function() {
    this.setText("");
  }
});

var DoubleClickLabel = FocusWidget.extend({
  init: function(value) {
    this._super(html.label(value));
    this.sinkEvents(Event.ONDBLCLICK);
  }, 
  addDoubleClickListener: function(listener) {
    this.doubleClickListener =listener;
    return this;
  },
  onBrowserEvent: function(event) {
    if (this.doubleClickListener) {
      this.doubleClickListener(this, event);

    }
  },

});

////////////////////////////////////////////////////

var headerView = FlowPanel.extend({
  init: function() {
    this._super();
    this.setId("header");
    this.render();
  },
  render: function() {
    var h1 = new Header1(["todos"]);
    this.add(h1);

    var input = new InputBox();
    input.setAttr("placeholder","What needs to be done?");
    input.setAttr("autofocus","autofocus");
    input.setId("new-todo");

    input.addEnterListener(function() {
      var text = input.getText();
      // Only add non-empty tasks, note that trim() is not supported
      // by IE <= 8 but since this is an TodoMVC app, that is okay
      var trimmedText = text.trim();
      if(trimmedText !== "") {
        var todo = new Todo(trimmedText); 

        todos.add(todo);
        input.clear();
      }
    });

    this.add(input);
    input.getElement().focus();
  }
});

var mainView = FlowPanel.extend({
  init: function() {
    var that = this;
    this._super();
    this.setId("main");
    this.render();

    window.nc.addListener("refresh", function() {
      that.render();
    });
  },
  render: function() {
    //If there are no items, hide me
    if(todos.size() === 0) {
      this.setVisible(false);
    } else {
      this.clear();
      this.setVisible(true);
      // This is an ugly version in use because there is no framework support for this

      var toggleAll = new FocusWidget(html.input({"id":"toggle-all","type":"checkbox"})); 
      if(todos.allTasksCompleted()) {
        // We need to use this since the UIObjects setAttr doesnt work. TODO 
        toggleAll.getElement().setAttribute("checked","");
      }
      toggleAll.addMouseDownListener(function() {
        todos.setAllCompleted(!todos.allTasksCompleted());
      });

      this.add(toggleAll);

      var toggleAllLabel = new Widget();
      toggleAllLabel.setElement(html.label({"for":"toggle-all"},"Mark all as complete"));
      this.add(toggleAllLabel);

      var ul = new FlowPanel();
      ul.setElement(html.ul());
      ul.setId("todo-list");

      for(var i=0; i< todos.size(); i++) {
        var todo = todos.get(i);
        var li = new FlowPanel();
        li.setElement(html.li());

        var view = new FlowPanel();
        view.setStyleName("view");

        var checkBox = new FocusWidget(html.input({"type":"checkbox","class":"toggle"}));
        checkBox.addMouseDownListener(function(currentTodo) {
          // The return statement is put here in order to create a new referncing
          // enviroment for in this closure
          return function() {
            currentTodo.toggleCompleted();
          };
        }(todo));

        // add styles and attributes for checked tasks
        if(todo.isCompleted()) {
          li.setStyleName("completed");
          // TODO: investigate why the setAttr cannot be called with the second 
          // argument as the empty string
          checkBox.setAttr("checked","true");
        }

        var edit = new InputBox();
        edit.setStyleName("edit");
        edit.setText(todo.getValue());

        edit.addOnBlurListener(function(i, li, edit) {
          return function() {
            var text = edit.getText();
            // Only add non-empty tasks, note that trim() is not supported
            // by IE <= 8 but since this is an TodoMVC app, that is okay
            var trimmedText = text.trim();
            if(trimmedText !== "") {
              li.removeStyleName("editing");
              todos.get(i).setValue(trimmedText);
              window.nc.postNotification("refresh", null);
            } else {
              todos.remove(i);
            }
          };
        }(i, li, edit));

        // Trigger the blur event with enter.
        edit.addEnterListener(function(edit) {
          return function() {
            edit.getElement().blur();
          }
        }(edit));

        var todoLabel = new DoubleClickLabel(todo.getValue());
        todoLabel.addDoubleClickListener(function(li, edit) {
          // The return statement is put here in order to create a new referncing
          // enviroment for in this closure
          return function() {
            // This div shows the edit box
            li.setStyleName("editing");
            edit.getElement().focus();
          };
        }(li, edit));

        var destroyButton = new FocusWidget(html.button({"class":"destroy"}));
        destroyButton.addMouseDownListener(function(index) {
          // The return statement is put here in order to create a new referncing
          // enviroment for in this closure
          return function() {
            todos.remove(index);
          };
        }(i));

        view.add(checkBox);
        view.add(todoLabel);
        view.add(destroyButton);
        li.add(view);
        li.add(edit); 
        ul.add(li);
      }
      this.add(ul);
    }
  }
});

var footerView = FlowPanel.extend({
  init: function() {
    var that = this;
    this._super();
    this.setId("footer");
    this.render();

    window.nc.addListener("refresh", function() {
      that.render();
    });
  },
  render: function() {
    //If there are no items, hide me
    if(todos.size() === 0) {
      this.setVisible(false);
    } else {
      this.clear();
      this.setVisible(true);
      todoCounter = new Widget();
      todoCounter.setElement(html.span({"id":"todo-count"}));

      var notCompletedItems = todos.amountNotCompleted();
      var completedItems = todos.amountCompleted();
      var text = "<strong>" + notCompletedItems + "</strong> item";
      if(notCompletedItems > 1)
        text += "s";
      text += " left";
      DOM.setInnerHTML(todoCounter.getElement(), text);
      
      this.add(todoCounter);  
      
      if(completedItems > 0) {
        var clearCompleted = new Button("Clear completed(" + completedItems + ")",
            function() {
              todos.clearCompleted();
            });
        clearCompleted.setId("clear-completed");

        this.add(clearCompleted);
      }
    }
  }
});

var infoView = FlowPanel.extend({
  init: function() {
    this._super();
    this.setId("info");
    this.render();
  },
  render: function() {
    var text = new Widget();
    text.setElement(html.p("Double-click to edit a todo"));
    this.add(text);
  }
});

////////////////////////////////////////////////////

$(document).ready(function() {
	var root = new RootPanel("boostrap");
	var todoApp = new FlowPanel();
	todoApp.setId("todoapp");

  var header = new headerView();
  var main = new mainView();
  var footer = new footerView();
  var info = new infoView();

  todoApp.add(header);
  todoApp.add(main);
  todoApp.add(footer);

  root.add(todoApp);
  root.add(info);
});
