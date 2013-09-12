var InputBoxBase = FocusWidget.extend({
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

var InputBox = InputBoxBase.extend({
  init: function() {
    this._super();
    this.addEnterListener(function() {
      addTodo(this.getText());
    });
  }
});

var EditBox = InputBoxBase.extend({
  init: function(i, li, todo) {
    this._super();
    this.setText(todo.value);
    this.addOnBlurListener(editTodo(i,li,this));

    // Trigger the blur event with enter.
    this.addEnterListener(function(edit) {
      return function() {
        edit.getElement().blur();
      };
    }(this));
  }
});

var DoubleClickLabel = FocusWidget.extend({
  init: function(todo, li, edit) {
    this._super(html.label(todo.value));
    this.sinkEvents(Event.ONDBLCLICK);

    this.addDoubleClickListener(function(li, edit) {
      // The return statement is put here in order to create a new referncing
      // enviroment for in this closure
      return function() {
        // This div shows the edit box
        li.setStyleName("editing");
        edit.getElement().focus();
      };
    }(li, edit));
  }, 
  addDoubleClickListener: function(listener) {
    this.doubleClickListener = listener;
    return this;
  },
  onBrowserEvent: function(event) {
    if (this.doubleClickListener) {
      this.doubleClickListener(this, event);
    }
  },
});

var CheckBox = FocusWidget.extend({
  init: function(todo) {
    this._super(html.input({"type":"checkbox","class":"toggle"}));
    this.addMouseDownListener(toggleTodo(todo));
    if (todo.completed) {
      this.setAttr("checked","true");
    }
  },
});

var DestroyButton = FocusWidget.extend({
  init: function(i) {
    this._super(html.button({"class":"destroy"}));
    this.addMouseDownListener(deleteTodo(i));
  }
});
