exports.define = function(thisArray, thisFunction){
  //const startup = function(){};
  //console.log(thisArray);
  //console.log(thisFunction);
  let testObj = {testarr: thisArray, testfunc: thisFunction};
  return testObj;
};

exports.declare = function(dArray, dObj){
  console.log('why!?');
  let declareObj = {testarr: dArray, testobj: dObj};
  console.log(declareObj);
if(declareObj.testarr !== null){
  if(declareObj.testarr.indexOf('open') !== -1)
  declareObj.testobj.open = true;
}
  if(declareObj.testobj.show){
    declareObj.testobj.startup = function(){};
    declareObj.testobj._setup = function(){};
    declareObj.testobj._set = function(){};
    declareObj.testobj._onShow = function(){};
    declareObj.testobj.resize = function(){};
    declareObj.testobj._position = function(){};
    declareObj.testobj._modalconnects = {push:function(){}};
    declareObj.testobj.show();
  }
  return declareObj;
}
