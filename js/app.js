var ENTER_KEY = 13;
var Todo = Class.extend({
  init: function(value) {
    this.value = value;
    this.completed = false;
  },
  setCompleted: function(completed) {
    this.completed = completed;
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
  get: function(id) {
    return this.todos[id];
  },
  remove: function(id) {
    delete this.todos[id];
  },
  size: function() {
    return this.todos.length;
  },
  setAllCompleted: function(completed) {
    for(var i=0; i<this.todos.length; i++) {
      this.todos[i].setCompleted(completed);
    }
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
    //If there are no items, hide me
    if(todos.size() === 0) {
      this.setStyle("display","none");
    } else {
      var toggleAll = new Widget();
      toggleAll.setElement(html.input({"id":"toggle-all","type":"checkbox"}));
      this.add(toggleAll);

      var toggleAllLabel = new Widget();
      toggleAllLabel.setElement(html.label({"for":"toggle-all"},"Mark all as complete"));
      this.add(toggleAllLabel);

      var ul = new FlowPanel();
      ul.setElement(html.ul());
      ul.setId("todo-list");

      console.log("render mainView with "+todos.size()+" todos");

      for(var i=0; i< todos.size(); i++) {
        var todo = todos.get(i);
        var li = new FlowPanel();
        li.setElement(html.li());
        li.setAttr("class","completed");

        var checkBox = new Widget();
        checkBox.setElement(html.input({"type":"checkbox","class":"toggle"}));
        li.add(checkBox);

        var task1Label = new Widget();
        task1Label.setElement(html.label("hardcoded todo."));
        li.add(task1Label);

        var task1Button = new Widget();
        task1Button.setElement(html.button({"class":"destroy"}));
        li.add(task1Button);

        ul.add(li);
      }
      this.add(ul);
    }
  }
});

var footerView = FlowPanel.extend({
  init: function() {
    this._super();
    this.setId("footer");
    this.render();
  },
  render: function() {
    //If there are no items, hide me
    if(todos.size() === 0) {
      this.setStyle("display","none");
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
