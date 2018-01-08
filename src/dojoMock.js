exports.define = function(thisArray, thisFunction) {
  let testObj = {testarr: thisArray, testfunc: thisFunction};
  return testObj;
};

exports.declare = function(dArray, dObj) {
  //console.log('why!?');
  let declareObj = {testarr: dArray, testobj: dObj};
  //console.log(declareObj);
  if (declareObj.testarr !== null) {
    if (declareObj.testarr[0].indexOf('open') !== -1) {
      declareObj.testobj.open = true;
    }
    if (declareObj.testarr[0].indexOf('_started') !== -1) {
      declareObj.testobj._started = true;
    }
    if (declareObj.testarr[0].indexOf('_alreadyInitialized') !== -1) {
      declareObj.testobj._alreadyInitialized = true;
    }
    if (declareObj.testarr[0].indexOf('_fadeOutDeferred') !== -1) {
      //declareObj.testobj._fadeOutDeferred = true;
      declareObj.testobj._fadeOutDeferred = {cancel:function() {}};
    }
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
    if ( declareObj.testobj._fadeInDeferred) {
      //console.log(declareObj.testobj._fadeInDeferred.something);
      declareObj.testobj._fadeInDeferred.something.fadeIn = {stop:function() {}};
      //declareObj.testobj.show();
      //declareObj.testobj._fadeInDeferred.something.thisFunction = function() {};
      //declareObj.testobj._fadeInDeferred.something.thisFunction();
    }
    //console.log(declareObj);
  }
  return declareObj;
};
