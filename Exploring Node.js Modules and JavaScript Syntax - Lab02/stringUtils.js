/* Todo: Implment the functions below and then export them
      using the module.exports syntax. 
      DO NOT CHANGE THE FUNCTION NAMES
*/

let palindromes = (string) => {
  //console.log(typeof string);
  if (
    typeof string != "string" ||
    string === undefined ||
    string.trim().length === 0
  ) {
    throw "Opsie!! Invalid input; Input string should exist with type as STRING";
  }
  let space = " ";
  let tempArray = [];
  let k = 0;
  let initialString = string
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(space);
  let arr = string
    .trim()
    .replace(/[^a-zA-Z0-9'' ]/g, "")
    .toLowerCase()
    .split(space);
  for (let i = 0; i < arr.length; i++) {
    let temp = arr[i].split("").reverse().join("");
    if (arr[i] === temp) {
      tempArray[k] = initialString[i];
      k++;
    }
  }
  return tempArray;
};

let replaceChar = (string) => {
  //console.log('string..',typeof string);
  if (typeof string != "string" || string.trim().length === 0) {
    throw "Not a valid string input!";
  }
  let length = string.trim().length;
  //console.log('length..',length);
  let trimmedString = string.trim();
  function changeCharAt(trimmedString, index, replaceWithChar) {
    if (index > length - 1) {
      return trimmedString;
    }
    return (
      trimmedString.substring(0, index) +
      replaceWithChar +
      trimmedString.substring(index + 1)
    );
  }
  for (let i = 0; i < length; i++) {
    trimmedString = changeCharAt(trimmedString, i + 1, "*");
    i += 3;
  }
  for (let i = 0; i < length; i++) {
    trimmedString = changeCharAt(trimmedString, i + 3, "$");
    i += 3;
  }
  return trimmedString;
};

let charSwap = (string1, string2) => {
  if (
    typeof string1 != "string" ||
    typeof string2 != "string" ||
    string1.trim().length === 0 ||
    string2.trim().length === 0 ||
    string1.trim().length < 4 ||
    string2.trim().length < 4
  ) {
    throw "Not a valid string input!";
  }
  let trimmedString1 = string1.trim();
  let trimmedString2 = string2.trim();

  let subStringString1 = trimmedString1.substring(0, 4);
  let subStringString1Remaining = trimmedString1.substring(
    4,
    trimmedString1.length
  );

  let subStringString2 = trimmedString2.substring(0, 4);
  let subStringString2Remaining = trimmedString2.substring(
    4,
    trimmedString2.length
  );

  return subStringString2
    .concat(subStringString1Remaining)
    .concat(" ", subStringString1)
    .concat(subStringString2Remaining);
};

module.exports = {
  palindromes,
  replaceChar,
  charSwap,
};
