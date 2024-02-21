const { arrayStats, makeObjects, commonElements } = require("./arrayUtils");
const { palindromes, replaceChar, charSwap } = require("./stringUtils");
const { deepEquality, commonKeysValues,calculateObject } = require("./objectUtils");

//arrayUtils test cases
try {
  //arrayStats Pass 
  console.log(arrayStats([11, 54, 79, 5, -25, 54, 19, 11, 56, 100])); // Returns: { mean: 36.4, median: 36.5, mode: [11,54], range: 125, minimum: -25, maximum: 100, count: 10, sum: 364 }
} catch (e) {
  console.log(e);
}
try {
  //arrayStats Fails succesfully
  console.log(arrayStats(["guitar", 1, 3, "apple"])); // throws an error
} catch (e) {
  console.log(e);
} 

try {
  //makeObjects Pass
  console.log(
    makeObjects(["foo", "bar"], ["name", "Patrick Hill"], ["foo", "not bar"])
  ); //returns {foo: "not bar", name: "Patrick Hill"}
} catch (e) {
  console.log(e);
}
try {
  //makeObjects Fails succesfully
  console.log(makeObjects({a:1,b:2}, [1, 2])); // throws an error
} catch (e) {
  console.log(e);
} 

try {
  //commonElements Pass
  const arr7 = [undefined, 5, "Patrick"];
  const arr8 = [null, undefined, true];
  console.log(commonElements(arr7, arr8)); // returns [undefined]
} catch (e) {
  console.log(e);
}

try {
  //commonElements Fails succesfully
  console.log(commonElements([1, 2, "nope"], [])); // throws error
} catch (e) {
  console.log(e);
} 

//stringUtils test cases
try {
  //pallindrome Pass
  console.log(palindromes("   Wow! Did you see that racecar go?")); // Returns: ["Wow", "Did", "racecar"]
} catch (e) {
  console.log(e);
}

try {
  //pallindrome Fails succesfully
  console.log(palindromes(["    hello there"])); //  throws error --> trim and them check the length
} catch (e) {
  console.log(e);
}

try {
  //replaceChar Pass
  console.log(replaceChar("   Hello, How are you? I hope you are well")); // Returns: "H*l$o* $o* $r* $o*?$I*h$p* $o* $r* $e*l"
} catch (e) {
  console.log(e);
}
try {
  //replaceChar Fails succesfully
  console.log(replaceChar(123)); // Throws Error
} catch (e) {
  console.log(e);
}

try {
  //charSwap Pass
  console.log(charSwap("Patrick     ", "Hill")); //Returns "Hillick Patr"
} catch (e) {
  console.log(e);
}
try {
  //charSwap Fails succesfully
  console.log(charSwap("John")); // Throws error
} catch (e) {
  console.log(e);
} 

//objectUtils test cases
try {
  //deepEquality Pass
  const forth = {
    a: { sA: "Hello", sB: "There", sC: "Class" },
    b: 7,
    c: true,
    d: "Test",
  };
  const fifth = {
    c: true,
    b: 7,
    d: "Test",
    a: { sB: "There", sC: "Class", sA: "Hello" },
  };
  console.log(deepEquality(forth, fifth)); // true
} catch (e) {
  console.log(e);
}
try {
  //deepEquality Fails succesfully
  console.log(deepEquality([1, 2, 3], [1, 2, 3])); // throws error
} catch (e) {
  console.log(e);
}

try {
  //commonKeysValues Pass
  const first = { name: { first: "Patrick", last: "Hill" }, age: 46 };
  const second = {
    school: "Stevens",
    name: { first: "Patrick", last: "Hill" },
  };
  console.log(commonKeysValues(first, second)); // returns  {name: {first: "Patrick", last: "Hill"}, first: "Patrick", last: "Hill"}
} catch (e) {
  console.log(e);
}
try {
  //commonKeysValues Fails succesfully
  console.log(commonKeysValues([], [1, 2, 3])); // throws error
} catch (e) {
  console.log(e);
}

try{
  //calculateObject Pass
  console.log(calculateObject({ a: 3, b: 7, c: 5 }, n => n * 2));
}catch(e){
  console.log(e);
}

try{
  //calculateObject Fails successfully
  
  console.log(calculateObject({ a: 2, b: 7, c: 5 }, ()=>{})); //?????
}catch(e){
  console.log(e);
}