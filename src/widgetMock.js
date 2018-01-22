//let testSwitch = '';
// exports.define = function(thisArray, thisFunction) {
//   let testObj = {testarr: thisArray, testfunc: thisFunction};
//   //testObj.testfunc();
//   return testObj;
// };
//
// exports.require = function(astring, afunc) {
//   afunc();
// };

exports.declare = function(dArray, dObj) {
  //window.App = {uploadInProgress:false, logout:function() {}, checkLogin:function() {}, timeout:function() {}};
  // let mockStorage = {
  //   //setItem: function(item, value) {
  //   //   //do nothing
  //   // },
  //   getItem: function(item, value) {
  //     return '{"expiry":12345}';
  //   }};
    //window.localStorage = mockStorage;
    let declareObj = {testarr: dArray, testobj: dObj};
    //if (declareObj.testarr !== null) {
      //declareObj.testobj.navigate = function() {};
      // declareObj.testobj.workspaceAPI = true;
      // declareObj.testobj.serviceAPI = true;
      // declareObj.testobj.dataAPI = '/howdy';
      // declareObj.testobj.user = {id:'123'};
      declareObj.testobj.submitButton = {set: function(field, bool) {document.body.className = '' +  bool;}};
      declareObj.testobj.unField = {value: '', get: function() {return this.value;}};
      declareObj.testobj.pwField = {value: '', get: function() {return this.value;}};
      return declareObj;
      //console.log(declareObj.testarr[0]);
  //  }
    // if (declareObj.testarr === null) {
    //
    // }
    // return class {constructor(declareObj) {
    //   this.declareObj = declareObj;
    //   this.set = function() {};
    //   this.show = function() {};
    //   //console.log(declareObj);
    // }
  };
//};
