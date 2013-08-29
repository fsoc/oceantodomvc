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
      addTodo(input.getText(), filter);
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
        // We need to use this since the UIObjects setAttr doesnt work with one parameter only. TODO 
        toggleAll.setAttr("checked","true");
      }
      toggleAll.addMouseDownListener(toggleAllTodos(filter));

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
          checkBox.addMouseDownListener(toggleTodo(todo, filter));

          // add styles and attributes for checked tasks
          if(todo.completed) {
            li.setStyleName("completed");
            // We need to use this since the UIObjects setAttr doesnt work with one parameter only. TODO 
            checkBox.setAttr("checked","true");
          }

          var edit = new InputBox();
          edit.setStyleName("edit");
          edit.setText(todo.value);

          edit.addOnBlurListener(editTodo(i,li,edit,filter));

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
          destroyButton.addMouseDownListener(deleteTodo(i, filter));

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
        clearCompletedTodos(filter));
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
