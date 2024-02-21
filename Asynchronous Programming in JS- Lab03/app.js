/*
This file is where you will import your functions from the two other files and run test cases on your functions by calling them with various inputs.  We will not use this file for grading and is only for your testing purposes to make sure:

1. Your functions in your 2 files are exporting correctly.

2. They are returning the correct output based on the input supplied (throwing errors when you're supposed to, returning the right results etc..).

Note: 
1. You will need an async function in your app.js file that awaits the calls to your function like the example below. You put all of your function calls within main each in its own try/catch block. and then you just call main().
2. Do not create any other files beside the 'package.json' - meaning your zip should only have the files and folder in this stub and a 'package.json' file.
3. Submit all files (including package.json) in a zip with your name in the following format: LastName_FirstName.zip.
4. DO NOT submit a zip containing your node_modules folder.
*/

const {
  getPersonById,
  sameJobTitle,
  getPostalCodes,
  sameCityAndState,
} = require("./people");

const { listEmployees, getCompanyById, sameIndustry } = require("./companies");

async function main() {
  //getPersonById test cases
  try {
    console.log(await getPersonById("fa36544d-bf92-4ed6-aa84-7085c6cb0440"));
  } catch (e) {
    console.log(e);
  }
  try {
    console.log(await getPersonById(-1)); //throws an error.
  } catch (e) {
    console.log(e);
  }

  //sameJobTitle test cases
  try {
    console.log(await sameJobTitle("Help Desk Operator"));
  } catch (e) {
    console.log(e);
  }
  try {
    console.log(await sameJobTitle()); // Throws Error
  } catch (e) {
    console.log(e);
  }

  //getPostalCodes test cases
  try {
    console.log(await getPostalCodes("Chicago", "Illinois"));
  } catch (e) {
    console.log(e);
  }
  try {
    //console.log(await getPostalCodes(13, 25)); // Throws Error
    console.log(await getPostalCodes("Bayside", "New York")); //Throws Error: There are no postal_codes for the given city and state combination
  } catch (e) {
    console.log(e);
  }

  //sameCityAndState test cases
  try {
    console.log(await sameCityAndState("Salt Lake City", "Utah")); //Returns: ['Vonnie Faichney', 'Townie Sandey',  'Eolande Slafford']
  } catch (e) {
    console.log(e);
  }
  try {
    console.log(await sameCityAndState("    ", "      "));
  } catch (e) {
    console.log(e);
  }  

  //getCompanyById test cases
  try {
    console.log(await getCompanyById("fb90892a-f7b9-4687-b497-d3b4606faddf"));
    //console.log(await getCompanyById('7989fa5e-5617-43f7-a931-46036f9dbcff'));// Throws company not found Error
  } catch (e) {
    console.log(e);
  }

  try {
    console.log(await getCompanyById(123)); //Throws Error
  } catch (e) {
    console.log(e);
  }

  //sameIndustry test cases
  try {
    console.log(await sameIndustry("Investment Managers"));
  } catch (e) {
    console.log(e);
  }
  try {
    console.log(console.log(await sameIndustry(" ")));
  } catch (e) {
    console.log(e);
  }

  //listEmployees test cases
  try{

     console.log(await listEmployees("Kemmer-Mohr"));

  }catch(e){
    console.log(e);
  }
  try{
    console.log(await listEmployees(123));
  }catch(e){
    console.log(e);
  }
}

//call main
main();
