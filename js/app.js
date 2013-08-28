var ENTER_KEY = 13;

var TodoList = Class.extend({
  init: function() {
    this.todos = [];
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
      if(curr.completed)
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
    if(this.amountNotCompleted() === 0)
      return true;
    else 
      return false;
  }
});

var todos = new TodoList();
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
    var that = this;
    this._super();
    this.setId("header");

    window.nc.addListener("refresh", function(filter) {
      that.render(filter);
    });
 },
  render: function(filter) {
    var filter = filter || '';
    this.clear();
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
        todos.add(trimmedText);
        window.nc.postNotification("refresh", filter);
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

    window.nc.addListener("refresh", function(filter) {
      that.render(filter);
    });
  },
  render: function(filter) {
    //If there are no items, hide me
    if(todos.size() === 0) {
      this.setVisible(false);
    } else {
      var filter = filter || '';
      this.clear();
      this.setVisible(true);
      // This is an ugly version in use because there is no framework support for this

      var toggleAll = new FocusWidget(html.input({"id":"toggle-all","type":"checkbox"})); 
      if(todos.allTasksCompleted()) {
        // We need to use this since the UIObjects setAttr doesnt work. TODO 
        toggleAll.getElement().setAttribute("checked","");
      }
      toggleAll.addMouseDownListener(function() {
        if(todos.allTasksCompleted())
          todos.setAllCompleted(false);
        else
          todos.setAllCompleted(true);
        window.nc.postNotification("refresh", filter);
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

        if ( (filter === "") || (filter === "active" && !todo.completed) || (filter === "completed" && todo.completed) ) {
          var li = new FlowPanel();
          li.setElement(html.li());

          var view = new FlowPanel();
          view.setStyleName("view");

          var checkBox = new FocusWidget(html.input({"type":"checkbox","class":"toggle"}));
          checkBox.addMouseDownListener(function(currentTodo) {
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
          }(todo));

          // add styles and attributes for checked tasks
          if(todo.completed) {
            li.setStyleName("completed");
            // TODO: investigate why the setAttr cannot be called with the second 
            // argument as the empty string
            checkBox.setAttr("checked","true");
          }

          var edit = new InputBox();
          edit.setStyleName("edit");
          edit.setText(todo.value);

          edit.addOnBlurListener(function(i, li, edit) {
            return function() {
              var text = edit.getText();
              // Only add non-empty tasks, note that trim() is not supported
              // by IE <= 8 but since this is an TodoMVC app, that is okay
              var trimmedText = text.trim();
              if(trimmedText !== "") {
                li.removeStyleName("editing");
                todos.get(i).value = trimmedText;
                window.nc.postNotification("refresh", filter);
              } else {
                todos.remove(i);
                window.nc.postNotification("refresh", filter);
              }
            };
          }(i, li, edit));

          // Trigger the blur event with enter.
          edit.addEnterListener(function(edit) {
            return function() {
              edit.getElement().blur();
            }
          }(edit));

          var todoLabel = new DoubleClickLabel(todo.value);
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
              window.nc.postNotification("refresh", filter);
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
          }
});

var footerView = FlowPanel.extend({
  init: function() {
    var that = this;
    this._super();
    this.setId("footer");

    window.nc.addListener("refresh", function(filter) {
      that.render(filter);
    });
  },
  render: function(filter) {
    //If there are no items, hide me
    if(todos.size() === 0) {
      this.setVisible(false);
    } else {
      var filter = filter || '';
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

      var ul = new FlowPanel();
      ul.setElement(html.ul());
      ul.setId("filters");

      var links = ["", "active", "completed"];
      var names = ["All", "Active", "Completed"];
      for (i = 0; i< links.length; i++) {
        var li = new FlowPanel(); 
        li.setElement(html.li());
        var link = new Link(['<a href="#/'+ links[i] +'">'+ names[i] +'</a>']);
        if (links[i] === filter) 
          link.setStyleName("selected");
        li.add(link);
        ul.add(li);
      }
      this.add(ul);
    
      if(completedItems > 0) {
        var clearCompleted = new Button("Clear completed(" + completedItems + ")",
          function() {
            todos.clearCompleted();
            window.nc.postNotification("refresh", filter);
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

	var HashFactory = HashFactoryBase.extend({
		init: function() {
			//This object handles all the actual flows in application thru set hash bong states
			//Syntax in URL: exampleApp.se/appname#!state|data
			//Example: exampleApp.se/hotels#!product|london/hilton/123451
			var self = this;
			this._super();

			$(window).bind('hashchange', function() {
        // Refresh the views with the '', 'active' or 'completed parameters
				window.nc.postNotification("refresh", self.parseURL());
      });
      // Do the same for the initial load of the page.
  		window.nc.postNotification("refresh", self.parseURL());
		},
		parseURL: function() {
			var hash = window.location.hash;
      //remove the first #/ part
			hash = hash.slice(2, hash.length);
      return hash;
    }
	});

	window.hf = new HashFactory();
});
