/* Todo: Implment the functions below and then export them
      using the module.exports syntax. 
      DO NOT CHANGE THE FUNCTION NAMES
*/

let deepEquality = (obj1, obj2) => {
  //console.log("is array..", obj1.constructor.name);
  if (
    obj1.constructor.name !== "Object" ||
    obj2.constructor.name !== "Object"
  ) {
    throw "The input is not an Object!";
  }
  let key1 = Object.keys(obj1);
  let key2 = Object.keys(obj2);
  if (key1.length !== key2.length) return false;
  for (const i of key1) {
    const val1 = obj1[i];
    const val2 = obj2[i];
    const temp =
      typeof val1 === "object" &&
      val1 != null &&
      typeof val2 === "object" &&
      val2 != null;
    // console.log("objects??..",temp);
    if ((temp && !deepEquality(val1, val2)) || (!temp && val1 !== val2)) {
      return false;
    }
  }
  return true;
};

let commonKeysValues = (obj1, obj2) => {
  //console.log(obj1);
  if (
    obj1 === undefined ||
    obj2 === undefined ||
    Object.keys(obj1).length === 0 ||
    Object.keys(obj2).length === 0 ||
    obj1.constructor.name !== "Object" ||
    obj2.constructor.name !== "Object"
  ) {
    throw "The input is not a valid Object!";
  }
  let keys1 = Object.keys(obj1);
  let returnObj = {};
  let returnOfInsideObject = {};
  keys1.forEach((i) => {
    if (obj2[i]) {
      if (typeof obj1[i] === typeof obj2[i]) {
        if (typeof obj2[i] != "object" && obj1[i] === obj2[i]) {
          //if not object and same values
          returnObj[i] = obj1[i];
        } else {
          let insideObject = {};
          let value1insideObject = obj1[i];
          let value2insideObject = obj2[i];
         let keys1insideObject = Object.keys(value1insideObject);
          //console.log('length of keys1insideObject...',keys1insideObject)
          keys1insideObject.forEach((j) => {
           if (value1insideObject[j] === value2insideObject[j]) {
              insideObject[j] = value1insideObject[j];
            }
            //console.log("insideObjet...", insideObject);
          });
          returnObj[i] = insideObject;
          returnOfInsideObject = value2insideObject;
        }
      }
    }
  });
  return { ...returnObj, ...returnOfInsideObject };
};

let calculateObject = (object, func) => {
  let keys = Object.keys(object);
  if (object === undefined || Object.keys(object).length === 0 || object.constructor.name !== "Object")
    throw "Object provided is not valid";
  if (func() === undefined ||  typeof func !== "function") throw "Function provided in not valid!";
  //console.log(func() === undefined)
  let returnObject ={};
  keys.forEach((i) => {
    //console.log("inside foreach", typeof (object[i]));
    if(typeof object[i] !== 'number') throw 'Object values are not numbers!!'
    object[i] = Number(func(object[i]));
    object[i] = Math.sqrt(object[i]);
    returnObject[i] = object[i].toFixed(2)
  });
  return returnObject;
};

module.exports = {
  deepEquality,
  commonKeysValues,
  calculateObject,
};
