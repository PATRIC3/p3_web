const TestApp = require('../../src/app/app.js');
const appTest = new TestApp();
const dojoStub = require('../dojoStub.js');
let djs = new dojoStub('closed', []);
const dojoMock = require('../../src/dojoMock.js');
//let Dialog = ['closed'];

describe('the Dojo App module', () => {

  beforeEach(() => {
//do nothing for now
});

it('creates the NMDialog', () => {
  appTest.testobj.testfunc(
    dojoMock.declare, 'parser',
    djs.Topic, djs.on, 'dom', djs.domClass, 'domAttr', djs.domStyle,
    djs.Registry, djs.xhr, djs.ContentPane, djs.fx,
    djs.Deferred, djs.query, 'nodeListDom',
    djs.Ready, djs.parser, 'rql', djs.lang,
    djs.Router, djs.Dialog, djs.domConstruct, djs.winUtils
  );
});

it('opens the NMDialog', () => {
  djs = new dojoStub('open', []);
  appTest.testobj.testfunc(
    dojoMock.declare, 'parser',
    djs.Topic, djs.on, 'dom', djs.domClass, 'domAttr', djs.domStyle,
    djs.Registry, djs.xhr, djs.ContentPane, djs.fx,
    djs.Deferred, djs.query, 'nodeListDom',
    djs.Ready, djs.parser, 'rql', djs.lang,
    djs.Router, djs.Dialog, djs.domConstruct, djs.winUtils
  );
});

it('detects when NMDialog has started, _alreadyInitialized, and fade out deferred', () => {
  djs = new dojoStub('closed', ['_started', '_alreadyInitialized', '_fadeOutDeferred']);
  //dialogState = 'closed';
  //otherDialogs = ['_started', '_alreadyInitialized', '_fadeOutDeferred'];
  appTest.testobj.testfunc(
    dojoMock.declare, 'parser',
    djs.Topic, djs.on, 'dom', djs.domClass, 'domAttr', djs.domStyle,
    djs.Registry, djs.xhr, djs.ContentPane, djs.fx,
    djs.Deferred, djs.query, 'nodeListDom',
    djs.Ready, djs.parser, 'rql', djs.lang,
    djs.Router, djs.Dialog, djs.domConstruct, djs.winUtils
  );
});

// it('navigates', () => {
//   appTest.testobj.testfunc(
//     declare, 'parser',
//     Topic, on, 'dom', domClass, 'domAttr', domStyle,
//     Registry, xhr, ContentPane, fx,
//     Deferred, query, 'nodeListDom',
//     Ready, parser, 'rql', lang,
//     Router, Dialog, domConstruct, winUtils
//   );
// });

// it('checks for auth required routes', () => {
//   appTest.testobj.testfunc(
//     declare, 'parser',
//     Topic, on, 'dom', domClass, 'domAttr', domStyle,
//     Registry, xhr, ContentPane, fx,
//     Deferred, query, 'nodeListDom',
//     Ready, parser, 'rql', lang,
//     Router, Dialog, domConstruct, winUtils
//   );
// });

it('does nothing', (done) =>{
  console.log('do nothing');
  console.log('do nothing');
  console.log('do nothing');
  expect(true).toBe(true);
  done();
});
});
