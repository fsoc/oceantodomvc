casper.start(url, function () {
 	this.clean();

	this.test.assertTitleMatch(/TodoMVC$/, "Page title contains TodoMVC");
	this.assertItemCount(0, "No todo at start");

	this.test.assertNotVisible("#main", "#main section is hidden");
	this.test.assertNotVisible("#toggle-all", "#toggle-all checkbox is hidden");
	this.test.assertNotVisible("#todo-count", "#todo-count span is hidden");
});

// Create and remove a first todo
casper.then(function () {
	this.addTodo("Some Task");
	this.assertItemCount(1, "One todo has been added, list contains 1 item");
	this.click("#todo-list li:first-child button");
	this.assertItemCount(0, "Todo has been removed");
});

// edit one
casper.then(function() {
	this.addTodo("Another Task");

	this.test.assertVisible("#todo-list li:first-child label");
	this.test.assertNotVisible("#todo-list li:first-child .edit");

	this.mouseEvent("dblclick", "#todo-list li:first-child label");
	this.unselectText("#todo-list li:first-child .edit");

	this.test.assertNotVisible("#todo-list li:first-child label");
	this.test.assertVisible("#todo-list li:first-child .edit");
	
	this.page.sendEvent("keypress", " edited");
	this.page.sendEvent("keypress", this.page.event.key.Enter);
	
	this.test.assertVisible("#todo-list li:first-child label");
	this.test.assertNotVisible("#todo-list li:first-child .edit");

	this.test.assertEquals(this.fetchText("#todo-list li:first-child label"), "Another Task edited", "Task title has been changed");
});


// edit one and onblur
casper.then(function() {
	this.addTodo("Conquer the world");

	this.test.assertVisible("#todo-list li:nth-child(2) label");

	this.mouseEvent("dblclick", "#todo-list li:nth-child(2) label");
	this.unselectText("#todo-list li:nth-child(2) .edit");

	this.page.sendEvent("keypress", " and the neighborhood");

	this.evaluate(function() {
		document.querySelector("#todo-list li:nth-child(2) .edit").blur();
	});

	this.test.assertVisible("#todo-list li:nth-child(2) label");
	this.test.assertNotVisible("#todo-list li:nth-child(2) .edit");

	this.test.assertEquals(this.fetchText("#todo-list li:nth-child(2) label"), "Conquer the world and the neighborhood", "Task title has been changed");
});

casper.run(function () {
  this.test.done();
});
