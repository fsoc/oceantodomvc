Oceanfront TodoMVC Example
===

Ocean is a lightweight, secure and fast cloud-architecture on top of which distributed multi-user client applications are built. Ocean also features a fully integrated development and testing pipeline as well as a distributed and very scalable runtime environment supporting continuous delivery. Ocean is open source. declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications. Oceanfront lets you use a powerful framework to build cross-browser compliant and powerful code directly with Javascript. 

[OceanFramework](http://www.oceanframework.net)

## Learning Framework Name

The [OceanFramework wiki](http://wiki.oceanframework.net/) is a great resource for getting started.

Here are some links you may find helpful:
* [OceanDev on Github](https://github.com/OceanDev)

Articles and guides from the community:

* [Architecture](http://wiki.oceanframework.net/index.php/Architecture_OceanFront)
* [Overview](http://wiki.oceanframework.net/index.php/Overview_OceanFront)

Get help from other Framework Name users:

* [Mailing list on Google Groups](https://groups.google.com/group/oceanframework)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/4lt4i/oceantodomvc/issues)._

## Implementation

This app uses an Object Oriented approach to implement TodoMVC. The different parts of the application knows mainly about themselves and communicate via eventlisteners.

The naming of the files are inspired from other TodoMVC implementations for clarity and generally works like this: The view builds up the html elements and assigns listeners where needed that communicate via a messaging system to the controller that is in charge of modifying the model and refresh the view.

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
casperjs test todo.js
```

And open index.html

## Testing
Install [casperjs](http://casperjs.org) and run:

## Credit

This TodoMVC application was created by [4lt4i](https://github.com/4lt4i).


