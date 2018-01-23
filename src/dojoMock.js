//let testSwitch = '';
exports.define = function(thisArray, thisFunction) {
  let testObj = {testarr: thisArray, testfunc: thisFunction};
  //testObj.testfunc();
  return testObj;
};

exports.require = function(astring, afunc) {
  afunc();
};

exports.declare = function(dArray, dObj) {
  window.App = {uploadInProgress:false, logout:function() {}, checkLogin:function() {}, timeout:function() {}};
  let mockStorage = {
    //setItem: function(item, value) {
    //   //do nothing
    // },
    getItem: function(item, value) {
      return '{"expiry":12345}';
    }};
    window.localStorage = mockStorage;
    let declareObj = {testarr: dArray, testobj: dObj};
    if (declareObj.testarr !== null) {
      declareObj.testobj.navigate = function() {};
      declareObj.testobj.workspaceAPI = true;
      declareObj.testobj.serviceAPI = true;
      declareObj.testobj.dataAPI = '/howdy';
      declareObj.testobj.user = {id:'123'};
      console.log(declareObj.testarr[0]);
      if (declareObj.testarr[0] !== 'appLogout' && declareObj.testarr[0] !== 'appRefreshUser' && declareObj.testarr[0] !== 'appLogin' && declareObj.testarr[0] !== 'app' && declareObj.testarr[0] !== 'notLogIn' && declareObj.testarr[0] !== 'notExpired' && declareObj.testarr[0] !== 'bodyAuth' && declareObj.testarr[0] !== 'bodyAuthAndLoggedOut' && declareObj.testarr[0] !== 'refreshToken') {
        let dialog = new declareObj.testarr[0];
        if (dialog.open) {
          declareObj.testobj.open = true;
        }
        if (dialog.otherDialogs.indexOf('_started') !== -1) {
          declareObj.testobj._started = true;
        }
        if (dialog.otherDialogs.indexOf('_alreadyInitialized') !== -1) {
          declareObj.testobj._alreadyInitialized = true;
        }
        if (dialog.otherDialogs.indexOf('_fadeOutDeferred') !== -1) {
          declareObj.testobj._fadeOutDeferred = {cancel:function() {}};
        }
      } else if (declareObj.testarr[0] === 'notLogIn') {
        console.log('test for not logged in');
        mockStorage = {
        //   setItem: function(item, value) {
        //   //do nothing
        // },
        getItem: function(item, value) {
          return null;
        }};
        window.localStorage = mockStorage;
        declareObj.testobj.inherited = function() {};
        declareObj.testobj.startup();
      } else if (declareObj.testarr[0] === 'notExpired') {
        console.log('test for not expired token');
        mockStorage = {
        //   setItem: function(item, value) {
        //   //do nothing
        // },
        getItem: function(item, value) {
          return '{"expiry":9516384984}';
        }};
        window.localStorage = mockStorage;
        declareObj.testobj.inherited = function() {};
        declareObj.testobj.startup();
      }
      else if (declareObj.testarr[0] === 'bodyAuth') {
        console.log('test for already set body Auth');
        mockStorage = {
        //   setItem: function(item, value) {
        //   //do nothing
        // },
        getItem: function(item, value) {
          return '{"expiry":9516384984}';
        }};
        window.localStorage = mockStorage;
        document.body.className = 'Authenticated';
        declareObj.testobj.inherited = function() {};
        declareObj.testobj.startup();
      }
      else if (declareObj.testarr[0] === 'bodyAuthAndLoggedOut') {
        console.log('test for already body auth but logged out');
        mockStorage = {
        //   setItem: function(item, value) {
        //   //do nothing
        // },
        getItem: function(item, value) {
          return null;
        }};
        window.localStorage = mockStorage;
        document.body.className = 'Authenticated';
        declareObj.testobj.inherited = function() {};
        declareObj.testobj.startup();
      }
      else if (declareObj.testarr[0] === 'refreshToken') {
        console.log('test for refresh token when mouse is moving');
        mockStorage = {setItem: function(item, value) {
          document.body.className = 'RefreshUser';
        }, getItem: function(item, value) {
          return '{"expiry":123}';
        }};
        window.localStorage = mockStorage;
        //document.body.className = 'Authenticated';
        declareObj.testobj.inherited = function() {};
        window.App.activeMouse = true;
        window.App.userServiceURL = 'http://test.com:3000';
        window.App.CheckLogin = function() {};
        //window.App.logout = function() {document.body.className = 'logout';};
        declareObj.testobj.startup();
      } else if (declareObj.testarr[0] === 'appLogin') {
        //console.log('test for refresh token when mouse is moving');
        mockStorage = {setItem: function(item, value) {
          if (item === 'userid') {
            document.body.className = value;
          }
        }
        // , getItem: function(item, value) {
        //   return '{"expiry":123}';
      //  }
      };
        window.localStorage = mockStorage;
        //document.body.className = 'Authenticated';
        declareObj.testobj.inherited = function() {};
        window.App.activeMouse = true;
        window.App.userServiceURL = 'http://test.com:3000';
        window.App.CheckLogin = function() {};
        //window.App.logout = function() {document.body.className = 'logout';};
        declareObj.testobj.login({un:'me@patricbrc.org'}, 'token');
      }
      else if (declareObj.testarr[0] === 'appRefreshUser') {
        //console.log('test for refresh token when mouse is moving');
        mockStorage = {setItem: function(item, value) {
          //if (item === 'userProfile') {
            document.body.className = value;
          //}
        }
        // , getItem: function(item, value) {
        //   return '{"expiry":123}';
        // }
      };
        window.localStorage = mockStorage;
        //document.body.className = 'Authenticated';
        declareObj.testobj.inherited = function() {};
        window.App.activeMouse = true;
        window.App.userServiceURL = 'http://test.com:3000';
        window.App.CheckLogin = function() {};
        //window.App.logout = function() {document.body.className = 'logout';};
        declareObj.testobj.refreshUser();
      }
      else if (declareObj.testarr[0] === 'appLogout') {
        //console.log('test for refresh token when mouse is moving');
        mockStorage = {
        //   setItem: function(item, value) {
        //   if (item === 'userProfile') {
        //     document.body.className = value;
        //   }
        // },
        // getItem: function(item, value) {
        //   return '{"expiry":123}';
        // },
        removeItem: function(item) {
          document.body.className = 'loggedOut';
        }};
        window.localStorage = mockStorage;
        //document.body.className = 'Authenticated';
        declareObj.testobj.inherited = function() {};
        window.App.activeMouse = true;
        window.App.userServiceURL = 'http://test.com:3000';
        window.App.CheckLogin = function() {};
        //window.App.logout = function() {document.body.className = 'logout';};
        window.App.uploadInProgress = true;
        declareObj.testobj.logout();
        window.App.uploadInProgress = false;
        declareObj.testobj.logout();
      }
      else {
        declareObj.testobj.inherited = function() {};
        declareObj.testobj.startup();
        declareObj.testobj.updateUserWorkspaceList({forEach:function(func) {func({name:'home'});}});
      }
      /* istanbul ignore else */
      if (declareObj.testobj.show) {
        declareObj.testobj.startup = function() {};
        declareObj.testobj._setup = function() {};
        declareObj.testobj._set = function() {};
        declareObj.testobj._onShow = function() {};
        declareObj.testobj.resize = function() {};
        declareObj.testobj._position = function() {};
        declareObj.testobj._modalconnects = {push:function() {}};
        declareObj.testobj.show();
      }
    } else {
      //if (declareObj.testobj.panels.type === undefined) {
      declareObj.testobj.panels = {low: {}, hi:{}};
      //}
      //console.log('yeah');
      declareObj.testobj.getApplicationContainer();
      let returnObj = declareObj.testobj.constructor();
      /* istanbul ignore if */
      if (returnObj !== undefined) {
        console.log(returnObj);
      }
      declareObj.testobj.getCurrentContainer();
      declareObj.testobj.getConstructor('accepts');
      declareObj.testobj._doNavigation(false);
      class Rabbit {constructor() {this.set = function() {};}}
      declareObj.testobj.getConstructor = function() {return Rabbit;};
      declareObj.testobj.getCurrentContainer = function() {return new Rabbit();};
      declareObj.testobj.getApplicationContainer = function() {return {removeChild:function() {}, addChild:function() {}};};
      declareObj.testobj._doNavigation({widgetClass: true});
      declareObj.testobj.getNavigationContent('/howdy/', 'application/json');
      declareObj.testobj.getNavigationContent('/howdy/', 'text/html');
      declareObj.testobj.getNavigationContent('/howdy/', 'howdy');
      //declareObj.testobj.navigate({href:'/howdy', pageTitle: 'yoyo'});
      declareObj.testobj.navigate({id:'/howdy', href:false, pageTitle:'yoyo'});
      //declareObj.testobj.navigate({id:'/howdy', href:true, pageTitle:false});
      window.App = {authorizationToken:null};
      declareObj.testobj._doNavigation({requireAuth: true});
      window.App = {blah:true};
      declareObj.testobj._doNavigation({requireAuth: true});
    }
    // if (declareObj.testarr === null) {
    //
    // }
    return class {constructor(declareObj) {
      this.declareObj = declareObj;
      this.set = function() {};
      this.show = function() {};
      //console.log(declareObj);
    }
  };
};
