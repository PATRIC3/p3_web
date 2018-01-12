exports.define = function(thisArray, thisFunction) {
  let testObj = {testarr: thisArray, testfunc: thisFunction};
  return testObj;
};

exports.declare = function(dArray, dObj) {
  let declareObj = {testarr: dArray, testobj: dObj};
  if (declareObj.testarr !== null) {
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
    let returnObj = declareObj.testobj.constructor();
    if (returnObj !== undefined) {
      console.log(returnObj);
    }
  }
  return class {constructor(declareObj) {
    this.declareObj = declareObj;
    this.set = function() {};
    this.show = function() {};
  }
};
};
