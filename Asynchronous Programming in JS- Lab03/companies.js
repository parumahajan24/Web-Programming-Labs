const axios = require("axios");
async function getPeople() {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/448017f5cb43e0d590adb744e676f4b5/raw/495e09557914db5d2f40141aaef60113eb19bb41/people.json"
  );
  return data; // this will be the array of people objects
}
async function getCompanies() {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/90b56a2abf10cfd88b2310b4a0ae3381/raw/f43962e103672e15f8ec2d5e19106e9d134e33c6/companies.json"
  );
  return data; // this will be the array of people objects
}

const listEmployees = async (companyName) => {
  if (!companyName) throw "No company name is provided as input.";
  if (typeof companyName !== "string")
    throw `${companyName} is not of proper type(string).`;
  if (companyName.trim().length === 0)
    throw "Given Company Name just has empty spaces.";

  const peopleResult = await getPeople();
  const companiesResult = await getCompanies();
  peopleResult.sort(function (a, b) {
    let firstCharA = a.last_name.charAt(0);
    let firstCharB = b.last_name.charAt(0);
    if (firstCharA > firstCharB) {
      return 1;
    } else if (firstCharA < firstCharB) {
      return -1;
    } else {
      return 0;
    }
  });
  //get the id from companies json since companyName is provided.
  //check this id in person json and get the firstName LastName into employees object
  if (
    (peopleResult || peopleResult !== undefined) &&
    (companiesResult || companiesResult !== undefined)
  ) {
    const company = companiesResult.find(
      (i) => i.name.toLowerCase() === companyName.toLowerCase()
    );
    if (company) {
      let peopleFirstName = [],
        peopleLastName = [],
        finalOutput = [];
      let companyId = company.id;
      peopleResult.map((i) => {
        if (i.company_id === companyId) {
          peopleFirstName.push(i.first_name);
          peopleLastName.push(i.last_name);
        }
      });
      //console.log(peopleFirstName)
      for (let i = 0; i < peopleFirstName.length; i++) {
        finalOutput.push(
          peopleFirstName[i].concat(" ").concat(peopleLastName[i])
        );
      }
      let objEmployee = { employees: finalOutput };
      return { ...company, ...objEmployee };
      //console.log("result..", { ...company, ...objEmployee });
    } else {
      throw `No comapny found for provided company name: ${companyName}`;
    }
  } else {
    return "No result is returned from the Server you are requesting data from!";
  }
};

const sameIndustry = async (industry) => {
  if (!industry) throw "No ID input is provided.";
  if (typeof industry !== "string")
    throw `Industry ${industry} is improper type(not string).`;
  if (industry.trim().length === 0)
    throw `Input ID just contains empty spaces.`;

  const companiesResult = await getCompanies();

  if (companiesResult || companiesResult !== undefined) {
    let finalResult = [];
    companiesResult.forEach((i) => {
      if (i.industry.toLowerCase() === industry.toLowerCase()) {
        finalResult.push(i);
      }
    });
    if (finalResult.length > 0) {
      return finalResult;
    } else {
      throw `No company found for industry: ${industry}.`;
    }
  } else {
    return "No result is returned from the Server you are requesting data from!";
  }
};

const getCompanyById = async (id) => {
  if (!id) throw "No ID input is provided.";
  if (typeof id !== "string") throw `${id} is improper type(not string).`;
  if (id.trim().length === 0) throw `Input ID just contains empty spaces.`;

  const companiesResult = await getCompanies();
  if (companiesResult || companiesResult !== undefined) {
    const companyById = companiesResult.find((i) => i.id === id);
    if (companyById) {
      return companyById;
    } else {
      throw `company not found`;
    }
  } else {
    return "No result is returned from the Server you are requesting data from!";
  }
};

module.exports = {
  //getPeople,
  //getCompanies,
  listEmployees,
  sameIndustry,
  getCompanyById,
};
