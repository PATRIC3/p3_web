const Test = require('../../src/app/p3app.js');
const p3appTest = new Test();
const dojoStub = require('../dojoStub.js');
let djs = new dojoStub('closed', []);
const dojoMock = require('../../src/dojoMock.js');
//const app = require('../../src/app/app.js');

describe('the Dojo p3app module', () => {

  beforeEach(() => {
    //do nothing for now
  });

  test('it does something', () => {
    //let thisTest =
    p3appTest.testobj.testfunc(
      dojoMock.declare,
      djs.Topic, djs.on, 'dojo/dom', 'dojo/dom-class', 'dojo/dom-attr', 'dojo/dom-construct', djs.query,
      'dijit/registry', djs.lang,
      djs.Deferred,
      'dojo/store/JsonRest', djs.Toaster,
      'dojo/ready', 'app', djs.Router,
      'dojo/window', '../widget/Drawer', 'dijit/layout/ContentPane',
      '../jsonrpc', '../panels', '../WorkspaceManager', 'dojo/keys',
      'dijit/Dialog', '../util/PathJoin', 'dojo/request'
    );
    // console.log('can I see the test object please?');
    // console.log(thisTest);
  });
});
