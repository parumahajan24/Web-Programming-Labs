/* Todo: Implment the functions below and then export them
      using the module.exports syntax. 
      DO NOT CHANGE THE FUNCTION NAMES
*/

let arrayStats = (array) => {
  let countString = 0;
  let isMixedArrayorNot = Array.isArray(array)
    ? (array) => {
        for (let i = 0; i < array.length; i++) {
          if (typeof array[i] === "string") {
            countString++;
          }
        }
        //console.log('total count..',countString)
        return countString;
      }
    : false;
  //check for isArray????
  if (
    !Array.isArray(array) ||
    array.length === 0 ||
    array === null ||
    isMixedArrayorNot(array) > 0
  ) {
    //console.log('inside if, throws an error')
    throw "The input array is invalid;";
  }

  let sortedArray = array.sort((x, y) => {
    return x - y;
  });
  let sum = sortedArray.reduce((total, current) => total + current);
  let count = sortedArray.length;
  let mean = sum / count;
  let midValue = Math.floor(count / 2);
  let median =
    count % 2
      ? sortedArray[midValue]
      : (sortedArray[midValue - 1] + sortedArray[midValue]) / 2.0;
  let countTemp = {};
  //let mode = {};
  sortedArray.forEach(function (e) {
    if (countTemp[e] === undefined) {
      countTemp[e] = 0;
    }
    countTemp[e]++;
  });
  let obj = countTemp;
  let temp = Object.keys(countTemp);
  let maMode = temp[0];
  for (let i = 0; i < temp.length; i++) {
    let value = temp[i];
    if (temp[value] > temp[maMode]) {
      maMode = value;
    }
  }
  //console.log('temp...', temp)

  const mode = (sortedArray) => {
    const mode = [];
    let max = 0,
      countMode = 0;

    for (let i = 0; i < count; i++) {
      const item = sortedArray[i];

      if (mode[item]) {
        mode[item]++;
      } else {
        mode[item] = 1;
      }

      if (countMode < mode[item]) {
        max = item;
        countMode = mode[item];
      }
    }

    return max;
  };
  //console.log('mode...',mode(array));
  let max = Math.max.apply(null, sortedArray);
  let min = Math.min.apply(null, sortedArray);
  let range = sortedArray[count - 1] - sortedArray[0];

  return {
    mean: Number(mean.toFixed(1)),
    median: median,
    max: max,
    min: min,
    count: count,
    sum: sum,
    range: range,
    //mode: mode(array)
  };
};

let makeObjects = (...arrays) => {
  if (arrays.length === 0) {
    throw "Not a valid array input!";
  }
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length != 2) {
      throw "Invalid input! Each array should have only two elements.";
    }
  }
  let obj = Object.fromEntries(arrays);
  return obj;
};

let commonElements = (...arrays) => {
  if (arrays.length === 0 || arrays.length < 2) {
    throw "Not a valid array-input!";
  }
  for (let i = 0; i < arrays.length; i++) {
    if (!arrays[i].length) {
      throw "Not a valid array-input!";
    }
  }
  //console.log(arrays.join('[]'));
  let temp1 = arrays.reduce((a, b) => a.filter((e) => b.includes(e)));
  return temp1;
};

module.exports = {
  arrayStats,
  makeObjects,
  commonElements,
};
