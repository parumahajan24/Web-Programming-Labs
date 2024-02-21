function questionOne(arr) {
  let finalPrime = [];
  arr.forEach(function (e) {
    function prime(num) {
      if (num <= 0 || num == 1) return false;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
          return false;
        }
      }
      return true;
    }
    let temp = prime(e);
    finalPrime.push(temp);
  });
  return finalPrime;
}

function questionTwo(startingNumber, commonRatio, numberOfTerms) {
  return startingNumber === 0 || commonRatio === 0 
    ? 0
    : ( numberOfTerms <= 0 || (numberOfTerms - Math.trunc(numberOfTerms)) > 0)
    ? "NaN" 
    : (startingNumber * (1 - Math.pow(commonRatio, numberOfTerms))) /
        (1 - commonRatio);
}

function questionThree(str) {
  let count = 0;
  str = str.split(" ").join('').toLowerCase();
  for(let i = 0; i< str.length; i++) { 
    (str[i].match(/[aeiou!@£$%^&*0-9-./,'?]/g)) ? count++ : []
  }
  return (str.length-count);
}

function questionFour(fullString, substring) {
  let singleCount = 0;
  let count = 0;
  function singleCountsubstr() {
    for (let i = 0; i < fullString.length; i++) {
      if(fullString[i]=== substring){
        singleCount++;
      }
    }
    return singleCount;
  }
  function countSubstr() {
    for (let i = 0; i < fullString.length; i++) {
      if(fullString[i] === substring[0]){
        for(let j = 1; j<substring.length; j++){
          if(fullString[i+j]=== substring[j]){
            if(j == substring.length-1){
              count++;
            }
          }
          else break;
        }
        i = i + substring.length -1;
      }  
    }
    return count;
  }

  return substring.length === 1 ? singleCountsubstr() : countSubstr();
}

//TODO:  Change the values for firstName, lastName and studentId
module.exports = {
  firstName: "PARUL",
  lastName: "MAHAJAN",
  studentId: "20010763",
  questionOne,
  questionTwo,
  questionThree,
  questionFour,
};
