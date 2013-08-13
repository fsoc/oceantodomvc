var InputBox = FocusWidget.extend({
  init: function() {
      this._super(DOM.createInputElement());
      this.sinkEvents(Event.ONKEYPRESS);
  },
  addEnterListener: function(listener) {
    this.enterListener =listener;
    return this;
  },
  onBrowserEvent: function(event) {
    if (this.enterListener) {
      // Only listen on keypresses with ENTER
      if(event.which === 13) {
        this.enterListener(this, event);
      }
    }
  },
  // Clear all input text data
  clear: function() {
    this.getElement().value = "";
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
    input.setId("new-todo");

    input.addEnterListener(function() { input.clear();});

    this.add(input);
  }
});

////////////////////////////////////////////////////

$(document).ready(function() {
	var root = new RootPanel("boostrap");
	var wrapper = new FlowPanel();
	wrapper.setId("todoapp");

  var header = new headerView();

  wrapper.add(header);

  root.add(wrapper);
});


