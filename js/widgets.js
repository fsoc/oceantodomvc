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

var CheckBox = FocusWidget.extend({
  init: function(todo, filter) {
    this._super(html.input({"type":"checkbox","class":"toggle"}));
    this.addMouseDownListener(toggleTodo(todo, filter));
    if (todo.completed) {
      this.setAttr("checked","true");
    }
  },
});
