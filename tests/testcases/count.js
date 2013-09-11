casper.start(url, function () {
  this.clean();

  this.test.assertTitleMatch(/TodoMVC$/);
  this.test.assertExists("#new-todo", "Task inputbox is available");
  this.test.assertDoesntExist("#todo-list", "The todo list doesnt exist in the beginning.");
  this.test.assertDoesntExist("#todo-count", "The todo count doesnt exist in the beginning.");

});

// Create a first todo
casper.then(function () {
  this.addTodo("Some Task");

  this.assertItemCount(1, "One todo has been added, list contains 1 item");

  this.assertLeftItemsString("1 item left", "Left todo list count is 1");

  this.test.assertEquals(this.fetchText("#todo-list li:first-child label"), "Some Task", "First todo is Some Task");

  this.test.assertVisible("#main", "#main section is displayed");
  this.test.assertVisible("#toggle-all", "#toggle-all checkbox is displayed");
  this.test.assertVisible("#todo-count", "#todo-count span is displayed");
});

// Create a second todo
casper.then(function () {
  // let"s test trim() => TODO in edit instead
  this.addTodo(" Some Another Task ");
  
  this.assertItemCount(2, "A second todo has been added, list contains 2 items");

  this.assertLeftItemsString("2 items left", "Left todo list count is 2");

  this.test.assertEquals(this.fetchText("#todo-list li:nth-child(2) label"), "Some Another Task", "Second todo is Some Another Task");
});

// Create a third todo and complete second
casper.then(function () {
  this.addTodo("A Third Task");

  this.assertLeftItemsString("3 items left", "One todo has been added, left todo list count is 3");

  this.test.assertNotVisible("#clear-completed", "#clear-completed button is hidden");

  this.click("#todo-list li:nth-child(2) input[type=checkbox]");

  this.assertLeftItemsString("2 items left", "Todo #2 has been completed, left todo list count is 2");

  // TODO check button string
  this.test.assertVisible("#clear-completed", "#clear-completed button is displayed");

  this.assertItemCount(3, "List still contains 3 items");
});

// Remove completed todo
casper.then(function () {
  this.click("#clear-completed");

  this.assertLeftItemsString("2 items left", "Todo #2 has been removed, left todo list count is still 2");

  this.test.assertEquals(this.fetchText("#todo-list li:nth-child(2) label"), "A Third Task", "Second left todo is previous third one");

  this.test.assertNotVisible("#clear-completed", "#clear-completed button is hidden once again");

  this.assertItemCount(2, "List contains 2 items");
});

// Complete all todos
casper.then(function () {
  this.click("#toggle-all");

  this.assertLeftItemsString("0 items left", "All todos completed, left list count is 0");
});

// Undo one completed todo and re-complete all todos
casper.then(function () {
  this.click("#todo-list li:nth-child(2) input[type=checkbox]");

  this.assertLeftItemsString("1 item left", "Todo #2 un-completed, left list count is 1");

  this.click("#toggle-all");

  this.assertLeftItemsString("0 items left", "All todos completed, left list count is 0");
});

// Undo all completed todo
casper.then(function () {
  this.click("#toggle-all");

  this.assertLeftItemsString("2 items left", "All todos un-completed, left list count is 2");
});

// Complete all one by one and check toggle-all button uncomplete them all
casper.then(function () {
  this.click("#todo-list li:nth-child(1) input[type=checkbox]");
  this.click("#todo-list li:nth-child(2) input[type=checkbox]");

  // TODO checkbox should be checked
  this.assertLeftItemsString("0 items left", "All todos completed one by one, left list count is 0");

  this.click("#toggle-all");

  this.assertLeftItemsString("2 items left", "All todos un-completed, left list cound is 2");
});

casper.run(function () {
  this.test.done();
});
