var headerView = FlowPanel.extend({
  init: function() {
    this._super();
    this.setId("header");
    this.render();
  },
  render: function() {
    var h1 = new Header1(["todos"]);
    this.add(h1);
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


