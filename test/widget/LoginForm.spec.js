const TestLogin = require('../../src/widget/LoginForm.js');
const tl = new TestLogin();
const dojoStub = require('../dojoStub.js');
let djs = new dojoStub('closed', []);
const widgetMock = require('../../src/widgetMock.js');
//const app = require('../../src/app/app.js');
//jest.useFakeTimers();
describe('the LoginForm Widget', () => {

  beforeEach(() => {

  });

  it('enables the submit button when username and password have been entered into the form', () => {
    const declareObj = tl.testobj.testfunc(
      widgetMock.declare,
      djs.WidgetBase, djs.on,
    	'dojo/dom-class', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin',
    	'dojo/text!./templates/LoginForm.html', 'dijit/form/Form', djs.xhr,
    	'dojo/dom-form', 'dojo/_base/lang', 'dojox/validate/web'
    );
    console.log(declareObj);
    declareObj.testobj.unField.value = 'username';
    declareObj.testobj.pwField.value = 'password';
    declareObj.testobj.fieldChanged();
    expect(document.body.className).toBe('false');
  });

  it('disables the submit button when username or password are empty', () => {
    const declareObj = tl.testobj.testfunc(
      widgetMock.declare,
      djs.WidgetBase, djs.on,
      'dojo/dom-class', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin',
      'dojo/text!./templates/LoginForm.html', 'dijit/form/Form', djs.xhr,
      'dojo/dom-form', 'dojo/_base/lang', 'dojox/validate/web'
    );
    console.log(declareObj);
    declareObj.testobj.unField.value = '';
    declareObj.testobj.pwField.value = '';
    declareObj.testobj.fieldChanged();
    expect(document.body.className).toBe('true');
  });

});
