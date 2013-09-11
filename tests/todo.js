casper.test.begin('Testing TodoMVC app', function suite(test) {
  var url = "../index.html";
  casper.start(url, function () {
    // Clear local storage
    casper.evaluate(function() {
      localStorage.clear();
    }, {});

    this.test.assertTitleMatch(/TodoMVC$/);
    this.test.assertExists("#new-todo", "Task inputbox is available");
    this.test.assertDoesntExist("#todo-list", "The todo list doesnt exist in the beginning.");
    this.test.assertDoesntExist("#todo-count", "The todo count doesnt exist in the beginning.");

  });

  casper.then(function () {
    this.evaluate(function() {
      document.querySelector("#new-todo").focus();
    });
    this.page.sendEvent("keydown", "text1");
    this.page.sendEvent("keydown", this.page.event.key.Enter);

    this.test.assertEval(function () {
      return document.querySelectorAll("#todo-list li").length === 1;
    }, "list contains one item");

    this.test.assertEquals(this.fetchText("#todo-list li:first-child label"),
                "text1", "Checking that the label matches");

    this.test.assertEquals(this.fetchText("#todo-count strong"), "1", "list counter is 1");
  });

  casper.run(function () {
      this.test.done();

  });
});
