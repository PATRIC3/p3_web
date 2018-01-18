const Test = require('../../src/app/p3app.js');
const p3appTest = new Test();
const dojoStub = require('../dojoStub.js');
let djs = new dojoStub('closed', []);
const dojoMock = require('../../src/dojoMock.js');
//const app = require('../../src/app/app.js');
jest.useFakeTimers();
describe('the Dojo p3app module', () => {

  beforeEach(() => {

  });

  it('starts up and checks for mousemove', () => {
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
    jest.runAllTimers();
  });

  it('does nothing when user is not logged in', () => {
    p3appTest.testobj.testfunc(
      dojoMock.declare,
      djs.Topic, djs.on, 'dojo/dom', 'dojo/dom-class', 'dojo/dom-attr', 'dojo/dom-construct', djs.query,
      'dijit/registry', djs.lang,
      djs.Deferred,
      'dojo/store/JsonRest', djs.Toaster,
      'dojo/ready', 'notLogIn', djs.Router,
      'dojo/window', '../widget/Drawer', 'dijit/layout/ContentPane',
      '../jsonrpc', '../panels', '../WorkspaceManager', 'dojo/keys',
      'dijit/Dialog', '../util/PathJoin', 'dojo/request'
    );
    jest.runAllTimers();
  });

  it('identifies a token that has not expired yet', () => {
    p3appTest.testobj.testfunc(
      dojoMock.declare,
      djs.Topic, djs.on, 'dojo/dom', 'dojo/dom-class', 'dojo/dom-attr', 'dojo/dom-construct', djs.query,
      'dijit/registry', djs.lang,
      djs.Deferred,
      'dojo/store/JsonRest', djs.Toaster,
      'dojo/ready', 'notExpired', djs.Router,
      'dojo/window', '../widget/Drawer', 'dijit/layout/ContentPane',
      '../jsonrpc', '../panels', '../WorkspaceManager', 'dojo/keys',
      'dijit/Dialog', '../util/PathJoin', 'dojo/request'
    );
    jest.runAllTimers();
    expect(document.body.className).toBe('Authenticated');
  });

  it('does not add Authenticated to the body class more than one time', () => {
    p3appTest.testobj.testfunc(
      dojoMock.declare,
      djs.Topic, djs.on, 'dojo/dom', 'dojo/dom-class', 'dojo/dom-attr', 'dojo/dom-construct', djs.query,
      'dijit/registry', djs.lang,
      djs.Deferred,
      'dojo/store/JsonRest', djs.Toaster,
      'dojo/ready', 'bodyAuth', djs.Router,
      'dojo/window', '../widget/Drawer', 'dijit/layout/ContentPane',
      '../jsonrpc', '../panels', '../WorkspaceManager', 'dojo/keys',
      'dijit/Dialog', '../util/PathJoin', 'dojo/request'
    );
    jest.runAllTimers();
    //console.log(document.body.className);
    expect(document.body.className).toBe('Authenticated');
  });

  it('routes other tabs to home page after one tab has logged out', () => {
    window.location.assign = jest.fn();
    //document.body.className = 'Authenticated';
    p3appTest.testobj.testfunc(
      dojoMock.declare,
      djs.Topic, djs.on, 'dojo/dom', 'dojo/dom-class', 'dojo/dom-attr', 'dojo/dom-construct', djs.query,
      'dijit/registry', djs.lang,
      djs.Deferred,
      'dojo/store/JsonRest', djs.Toaster,
      'dojo/ready', 'bodyAuthAndLoggedOut', djs.Router,
      'dojo/window', '../widget/Drawer', 'dijit/layout/ContentPane',
      '../jsonrpc', '../panels', '../WorkspaceManager', 'dojo/keys',
      'dijit/Dialog', '../util/PathJoin', 'dojo/request'
    );
    jest.runAllTimers();
    //console.log(document.body.className);
    expect(document.body.className).not.toBe('Authenticated');
  });

});
