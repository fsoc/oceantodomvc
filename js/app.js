var ENTER_KEY = 13;
var Todo = Class.extend({
  init: function(value) {
    this.value = value;
    this.completed = false;
  },
  setCompleted: function(boolean) {
    this.completed = boolean;
  },
  getValue: function() {
    return this.value;
  }
});

var TodoList = Class.extend({
  init: function() {
    this.todos = [];
  },
  add: function(todo) {
    this.todos.push(todo);
  },
  remove: function(id) {
    delete this.todos[id];
  },
  size: function() {
    return this.todos.length;
  }
});

var todos = new TodoList();

var InputBox = FocusWidget.extend({
  init: function() {
      // This function exists because createInputElement contains
      // deprecated jQuery code.
      this._super(html.input());
      this.sinkEvents(Event.ONKEYPRESS);
      this.value = this.getElement().value;
  },
  addEnterListener: function(listener) {
    this.enterListener =listener;
    return this;
  },
  onBrowserEvent: function(event) {
    if (this.enterListener) {
      // Only listen on keypresses with ENTER
      if(event.which === ENTER_KEY) {
        this.enterListener(this, event);
      }
    }
  },
  getText:function() {
    return DOM.getAttribute(this.getElement(),"value");
  },
  setText:function(text) {
    return DOM.setAttribute(this.getElement(),"value",text);
  },
  // Clear all input text data
  clear: function() {
    this.setText("");
  }
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
      if(text.trim() !== "") {
        var todo = new Todo(text); 

        todos.add(todo);
        console.log("added "+text+" count "+todos.size());
        input.clear();
      }
    });

    this.add(input);
  }
});

var mainView = FlowPanel.extend({
  init: function() {
    this._super();
    this.setId("main");
    this.render();
  },
  render: function() {
  }
});

var footerView = FlowPanel.extend({
  init: function() {
    this._super();
    this.setId("footer");
    this.render();
  },
  render: function() {
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
