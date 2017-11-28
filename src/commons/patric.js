// exports.showHideElements = function(appName, pArr, nArr){
//   let element;
//   for (let i = 0; i < pArr.length; i++){
//     element = document.getElementsByClassName(pArr[i])[0];
//     if (appName === 'PATRIC'){
//       element.style.display = 'block';
//     } else {
//       element.style.display = 'none';
//     }
//   }
//   for (let j = 0; j < nArr.length; j++){
//     element = document.getElementsByClassName(nArr[j])[0];
//     if (appName === 'PATRIC'){
//       element.style.display = 'none';
//     } else {
//       element.style.display = 'block';
//     }
//   }
// };

exports.showHideElements2 = function(appName, objofElements) {
  let objKeys = Object.keys(objofElements);
  let element;
  for (let i = 0; i < objKeys.length; i++) {
    for (j = 0; j < objofElements[objKeys[i]].length; j++) {
      element = objofElements[objKeys[i]][j];
      document.getElementsByClassName(element)[0].style.display = 'none';
      if ((appName === objKeys[i]) || (objKeys[i] !== 'PATRIC' && appName !== 'PATRIC')) {
        document.getElementsByClassName(element)[0].style.display = 'block';
      }
      //   if (){document.getElementsByClassName(element)[0].style.display = 'block';}
    }
  }
};

exports.nevermind = function(className) {
  let regform1 = document.getElementsByClassName(className);
  if (regform1[0] !== undefined) {
    regform1[0].style.display = 'none';
  }
};
