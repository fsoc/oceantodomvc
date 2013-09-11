casper.test.begin('Testing TodoMVC app', function suite(test) {

  ////
 casper.addTodo = function(title) {
	// TODO about initial focus testing
	this.evaluate(function() {
		document.querySelector('#new-todo').focus();
	});
	this.page.sendEvent('keydown', title);
	// TODO remove one, but keep which event ? Jquery impl prefers keyup...
	this.page.sendEvent('keydown', this.page.event.key.Enter);
	this.page.sendEvent('keyup', this.page.event.key.Enter);
  };

  // TODO rename "displayed" items
  casper.assertItemCount = function(itemsNumber, message) {
    this.test.assertEval(function (itemsAwaitedNumber) {
      var items = document.querySelectorAll('#todo-list li');
      var number = 0;
      for(var i = 0 ; i < items.length ; i++) {
        // how to accept only displayed elements ?
        // => https://groups.google.com/forum/?fromgroups=#!topic/jquery-dev/4Ys5mzbQP08
        // __utils__.visible seems not to work in this case...
        if(items[i].offsetWidth > 0 || items[i].offsetHeight > 0) {
          number++;
        }
      }
      //__utils__.echo(number);
      return number === itemsAwaitedNumber;
    }, message, itemsNumber);
  }

  casper.assertLeftItemsString = function(leftItemsString, message) {
    // Backbone for example does not update string since it's not displayed. It's a valid optimization
    if(leftItemsString == '0 items left' && !this.visible('#todo-count')) {
      this.test.assertTrue(true, 'Left items label is not displayed - ' + message);
      return;
    }
    var displayedString = this.fetchText('#todo-count').replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim();
    this.test.assertEquals(displayedString, leftItemsString, message);
  };

  // Implementations differ but text in input should not be selected when editing
  // => this function should not have to be called
  casper.unselectText = function(selector) {
    var textLength = this.getElementAttribute(selector, 'value').length;
    // without this if setSelectionRange breaks Vanilla JS & anothers test run
    if(textLength != 0) {
      this.evaluate(function(selector, textLength) {
        document.querySelector(selector).setSelectionRange(textLength, textLength);
      }, selector, textLength);
    }
  }

  //// 
  var url = "index.html";
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

  // Create a first todo
  casper.then(function () {
    this.addTodo('Some Task');

    this.assertItemCount(1, 'One todo has been added, list contains 1 item');

    this.assertLeftItemsString('1 item left', 'Left todo list count is 1');

    this.test.assertEquals(this.fetchText('#todo-list li:first-child label'), 'Some Task', 'First todo is "Some Task"');

    this.test.assertVisible('#main', '#main section is displayed');
    this.test.assertVisible('#toggle-all', '#toggle-all checkbox is displayed');
    this.test.assertVisible('#todo-count', '#todo-count span is displayed');
  });

  // Create a second todo
  casper.then(function () {
    // let's test trim() => TODO in edit instead
    this.addTodo(' Some Another Task ');
    
    this.assertItemCount(2, 'A second todo has been added, list contains 2 items');

    this.assertLeftItemsString('2 items left', 'Left todo list count is 2');

    this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'Some Another Task', 'Second todo is "Some Another Task"');
  });

  // Create a third todo and complete second
  casper.then(function () {
    this.addTodo('A Third Task');

    this.assertLeftItemsString('3 items left', 'One todo has been added, left todo list count is 3');

    this.test.assertNotVisible('#clear-completed', '#clear-completed button is hidden');

    this.click('#todo-list li:nth-child(2) input[type=checkbox]');

    this.assertLeftItemsString('2 items left', 'Todo #2 has been completed, left todo list count is 2');

    // TODO check button string
    this.test.assertVisible('#clear-completed', '#clear-completed button is displayed');

    this.assertItemCount(3, 'List still contains 3 items');
  });

  // Remove completed todo
  casper.then(function () {
    this.click('#clear-completed');

    this.assertLeftItemsString('2 items left', 'Todo #2 has been removed, left todo list count is still 2');

    this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'A Third Task', 'Second left todo is previous third one');

    this.test.assertNotVisible('#clear-completed', '#clear-completed button is hidden once again');

    this.assertItemCount(2, 'List contains 2 items');
  });

  // Complete all todos
  casper.then(function () {
    this.click('#toggle-all');

    this.assertLeftItemsString('0 items left', 'All todos completed, left list count is 0');
  });

  // Undo one completed todo and re-complete all todos
  casper.then(function () {
    this.click('#todo-list li:nth-child(2) input[type=checkbox]');

    this.assertLeftItemsString('1 item left', 'Todo #2 un-completed, left list count is 1');

    this.click('#toggle-all');

    this.assertLeftItemsString('0 items left', 'All todos completed, left list count is 0');
  });

  // Undo all completed todo
  casper.then(function () {
    this.click('#toggle-all');

    this.assertLeftItemsString('2 items left', 'All todos un-completed, left list count is 2');
  });

  // Complete all one by one and check toggle-all button uncomplete them all
  casper.then(function () {
    this.click('#todo-list li:nth-child(1) input[type=checkbox]');
    this.click('#todo-list li:nth-child(2) input[type=checkbox]');

    // TODO checkbox should be checked
    this.assertLeftItemsString('0 items left', 'All todos completed one by one, left list count is 0');

    this.click('#toggle-all');

    this.assertLeftItemsString('2 items left', 'All todos un-completed, left list cound is 2');
  });


  casper.run(function () {
      this.test.done();

  });
});
