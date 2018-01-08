const Test = require('../../src/app/app.js');
const appTest = new Test();
const winUtils = {get:function() {}};
//const lang = require('../../public/js/dojo/_base/lang');
const lang = {hitch:function(myModule, myFunction) {
  //console.log(myModule);
  return {thisModule: myModule, thisFunction: myFunction};}};
const on = function() {};
const domStyle = {set:function() {}};
const Deferred = class {constructor(something) {this.something = something;}};
const fx = {fadeIn:function() {return {play:function() {}};}};
let Dialog = ['closed'];

test('it creates the NMDialog', () => {
  appTest.testobj.testfunc(
    'declare', 'parser',
    'Topic', on, 'dom', 'domClass', 'domAttr', domStyle,
    'Registry', 'xhr', 'ContentPane', fx,
    Deferred, 'query', 'nodeListDom',
    'Ready', 'Parser', 'rql', lang,
    'Router', Dialog, 'domConstruct', winUtils
  );
});

test('it opens the NMDialog', () => {
  Dialog = ['open'];
  appTest.testobj.testfunc(
    'declare', 'parser',
    'Topic', on, 'dom', 'domClass', 'domAttr', domStyle,
    'Registry', 'xhr', 'ContentPane', fx,
    Deferred, 'query', 'nodeListDom',
    'Ready', 'Parser', 'rql', lang,
    'Router', Dialog, 'domConstruct', winUtils
  );
});

test('The NMDialog knows when it has started, _alreadyInitialized, and fade out deferred', () => {
  Dialog = ['closed', '_started', '_alreadyInitialized', '_fadeOutDeferred'];
  //lang.hitch = {}
  appTest.testobj.testfunc(
    'declare', 'parser',
    'Topic', on, 'dom', 'domClass', 'domAttr', domStyle,
    'Registry', 'xhr', 'ContentPane', fx,
    Deferred, 'query', 'nodeListDom',
    'Ready', 'Parser', 'rql', lang,
    'Router', Dialog, 'domConstruct', winUtils
  );
});
