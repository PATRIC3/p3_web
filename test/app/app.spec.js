const Test = require('../../src/app/app.js');
const appTest = new Test();
function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
const dojoMock = require('../../src/dojoMock.js');
const declare = dojoMock.declare;
const Topic = {publish:function() {}, subscribe:function() {}};
const winUtils = {get:function() {}};
const Ready = function(myModule, myFunction) {
  if (isFunction(myFunction)) {
    myFunction();
  }
  return {readyMod: myModule, readyFunc: myFunction};};
//const lang = require('../../public/js/dojo/_base/lang');
const lang = {hitch:function(myModule, myFunction, doNothing) {
  //console.log(myModule);
  return {thisModule: myModule, thisFunction: myFunction, thisDoN: doNothing};}};
const on = function(location, eventtype, action) {
  if (isFunction(action)) {
    action({target: {href: {split:function() {return ['one', 'two'];}}, attributes:{rel:{value:'low:hi'}}, parentNode:{}}, data:'RemoteReady', preventDefault: function() {}, stopPropagation: function() {}});
  }
  return {onLoc:location, onEvt: eventtype, onFunc: action};
};
const domClass = {contains: function() {}, add: function() {}, remove: function() {}};
const domStyle = {set:function() {}};
let Deferred = class {constructor(something) {this.something = something;
}};
Deferred.when = function(myobj, myfunc) {
  // myobj.title = 'awesome';
  // myobj.startup = function() {};
  if (myobj === undefined) {
      myfunc({title:'awesome', startup:function() {}, on:function() {}});
  }

};
const query = function() {return {removeClass: function() {}};};
const fx = {fadeIn:function() {return {play:function() {}};}};
const parser = {parse: function() {return {then:function(aFunc) {
  aFunc();
}};}};
const Router = {startup:function() {}, go:function() {}};
const Registry = {byId:function() {return {selectChild:function() {}};}};
const domConstruct = {place:function() {}};
let dialogState = 'closed';
let otherDialogs = [];
const Dialog = class {constructor(dialogTypes) {this.dialogTypes = dialogTypes;
this.show = function() {};
this.set = function() {};
if (dialogState === 'open') {
  this.open = true;
}
this.otherDialogs = otherDialogs;
}};
//let Dialog = ['closed'];

describe('the Dojo App module', () => {

  beforeEach(() => {
//do nothing for now
});

it('creates the NMDialog', () => {
  appTest.testobj.testfunc(
    declare, 'parser',
    Topic, on, 'dom', domClass, 'domAttr', domStyle,
    Registry, 'xhr', 'ContentPane', fx,
    Deferred, query, 'nodeListDom',
    Ready, parser, 'rql', lang,
    Router, Dialog, domConstruct, winUtils
  );
});

it('opens the NMDialog', () => {
  dialogState = 'open';
  appTest.testobj.testfunc(
    declare, 'parser',
    Topic, on, 'dom', domClass, 'domAttr', domStyle,
    Registry, 'xhr', 'ContentPane', fx,
    Deferred, query, 'nodeListDom',
    Ready, parser, 'rql', lang,
    Router, Dialog, domConstruct, winUtils
  );
});

it('detects when NMDialog has started, _alreadyInitialized, and fade out deferred', () => {
  dialogState = 'closed';
  otherDialogs = ['_started', '_alreadyInitialized', '_fadeOutDeferred'];
  appTest.testobj.testfunc(
    declare, 'parser',
    Topic, on, 'dom', domClass, 'domAttr', domStyle,
    Registry, 'xhr', 'ContentPane', fx,
    Deferred, query, 'nodeListDom',
    Ready, parser, 'rql', lang,
    Router, Dialog, domConstruct, winUtils
  );
});
it('does nothing', (done) =>{
  console.log('do nothing');
  console.log('do nothing');
  console.log('do nothing');
  expect(true).toBe(true);
  done();
});
});
