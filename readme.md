OF TodoMVC Example
===

OF builds on a lightweight, secure and fast cloud-architecture on top of which distributed multi-user client applications are built. OF also features a fully integrated development and testing pipeline as well as a distributed and very scalable runtime environment supporting continuous delivery. OF is open source. declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications. OF lets you use a powerful framework to build cross-browser compliant and powerful code directly with Javascript. 

[OF](http://www.oceanframework.net)

## Implementation

This app uses an Object Oriented approach to implement TodoMVC. The different parts of the application knows mainly about themselves and communicate via eventlisteners.

The naming of the files are inspired from other TodoMVC implementations for clarity and generally works like this: The view builds up the html elements and assigns listeners where needed that communicate via a messaging system to the controller that is in charge of modifying the model and refresh the view.

## CI

There are automatic tests running on [Travis](https://travis-ci.org/4lt4i/oceantodomvc) at every commit, and the status is:

![status](https://api.travis-ci.org/4lt4i/oceantodomvc.png)

## Running

After checking out the project, remember to include the oceanfront submodule.
```
git submodule init
git submodule update
```

And open index.html

## Testing
Install [casperjs](http://casperjs.org) and run:

```
casperjs test tests/testcases/ --includes=tests/inc.js
```

## Credit

This TodoMVC application was created by [fsoc](https://github.com/fsoc).


