const Test = require('../../src/app/app.js');
const appTest = new Test();
const winUtils = {get:function(){}};
const lang = {hitch:function(){}};
const on = function(){};
const domStyle = {set:function(){}};
const Deferred = class {constructor(something){}};
const fx = {fadeIn:function(){return {play:function(){}}}};
let Dialog = 'closed'

test('defines the app', () => {
  const appTest = new Test();
  // let thisArray = [];
  // let thisFunction = function(){};
  //console.log(appTest.testobj);
  //Test.define(thisArray, thisFunction);
  //expect(document.body.innerHTML).toMatch(/Verify Your Email Address/);
});

// test('it calls the app define function', () => {
//   const appTest = new Test();
//   // let thisArray = [];
//   // let thisFunction = function(){};
//   appTest.testobj.testfunc();
//   //console.log(appTest.testobj);
//   //Test.define(thisArray, thisFunction);
//   //expect(document.body.innerHTML).toMatch(/Verify Your Email Address/);
// });

test('it creates the NMDialog', () => {
appTest.testobj.testfunc(
  'declare', 'parser',
	'Topic', on, 'dom', 'domClass', 'domAttr',domStyle,
	'Registry', 'xhr', 'ContentPane',fx,
	Deferred,'query','nodeListDom',
	'Ready', 'Parser', 'rql', lang,
	'Router', Dialog, 'domConstruct', winUtils
);
  //console.log(appTest.testobj);
  //Test.define(thisArray, thisFunction);
  //expect(document.body.innerHTML).toMatch(/Verify Your Email Address/);
});

test('it opens the NMDialog', () => {
Dialog = 'open';
appTest.testobj.testfunc(
  'declare', 'parser',
	'Topic', on, 'dom', 'domClass', 'domAttr',domStyle,
	'Registry', 'xhr', 'ContentPane',fx,
	Deferred,'query','nodeListDom',
	'Ready', 'Parser', 'rql', lang,
	'Router', Dialog, 'domConstruct', winUtils
);
//expect(result.promise).toBe('revolved');
  //console.log(appTest.testobj);
  //Test.define(thisArray, thisFunction);
  //expect(document.body.innerHTML).toMatch(/Verify Your Email Address/);
});
