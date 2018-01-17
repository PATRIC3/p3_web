class dojoStub {constructor(dialogState, otherDialogs) {
  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }
  this.xhr = {get:function(url, data) {}};
  this.ContentPane = class {constructor(something) {this.something = something;}};
  //this.dojoMock = require('../../src/dojoMock.js');
  //this.declare = dojoMock.declare;
  this.Topic = {publish:function() {}, subscribe:function() {}};
  this.winUtils = {get:function() {}};
  this.Ready = function(myModule, myFunction) {
    if (isFunction(myFunction)) {
      myFunction();
    }
    return {readyMod: myModule, readyFunc: myFunction};
  };
  //const lang = require('../../public/js/dojo/_base/lang');
  this.lang = {hitch:function(myModule, myFunction, doNothing) {
    //console.log(myModule);
    return {thisModule: myModule, thisFunction: myFunction, thisDoN: doNothing};}
  };
  this.on = function(location, eventtype, action) {
    if (isFunction(action)) {
      action({target: {href: {split:function() {return ['one', 'two'];}}, attributes:{rel:{value:'low:hi'}}, parentNode:{}}, data:'RemoteReady', preventDefault: function() {}, stopPropagation: function() {}});
    }
    return {onLoc:location, onEvt: eventtype, onFunc: action};
  };
  this.domClass = {contains: function() {}, add: function() {}, remove: function() {}};
  this.domStyle = {set:function() {}};
  this.Deferred = class {constructor(something) {this.something = something;
    this.resolve = function() {};
    // this.when = function(myobj, myfunc) {
    //   if (myobj === undefined) {
    //     myfunc({title:'awesome', startup:function() {}, on:function() {}});
    //   } else {
    //     myfunc(myobj);
    //   }
    // };
  }};
  this.Deferred.when = function(myobj, myfunc) {
    if (myobj === undefined) {
      myfunc({title:'awesome', startup:function() {}, on:function() {}});
    } else {
      myfunc(myobj);
    }

  };
  // Deferred.resolve = function() {};
  this.query = function() {return {removeClass: function() {}};};
  this.fx = {fadeIn:function() {return {play:function() {}};}};
  this.parser = {parse: function() {return {then:function(aFunc) {aFunc();}};}};
  this.Router = {startup:function() {}, go:function() {}, register:function() {}};
  this.Registry = {byId:function() {return {getChildren:function() {return {filter:function(myfun) {myfun({region:''});}};}, selectChild:function() {}};}};
  this.domConstruct = {place:function() {}};
  this.dialogState = 'closed';
  this.otherDialogs = [];
  this.Dialog = class {constructor(dialogTypes) {
    this.dialogTypes = dialogTypes;
    this.show = function() {};
    this.set = function() {};
    if (dialogState === 'open') {
      this.open = true;
    }
    this.otherDialogs = otherDialogs;
  }};
  this.Toaster = class {constructor() {
    // this.dialogTypes = dialogTypes;
    // this.show = function() {};
    // this.set = function() {};
    // if (dialogState === 'open') {
    //   this.open = true;
    // }
    // this.otherDialogs = otherDialogs;
  }};
}}
module.exports = dojoStub;
