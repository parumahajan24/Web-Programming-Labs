const axios = require("axios");

async function getPeople() {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/448017f5cb43e0d590adb744e676f4b5/raw/495e09557914db5d2f40141aaef60113eb19bb41/people.json"
  );
  return data; 
}

const getPersonById = async (id) => {
  if (!id) throw "No ID input is provided.";
  if (typeof id !== "string") throw `${id} is improper type(not string).`;
  if (id.trim().length === 0) throw `Input ID just contains empty spaces.`;

  const resultById = await getPeople();
  //console.log("result ...", resultById);

  if (resultById || resultById !== undefined) {
    const personById = resultById.find((x) => x.id === id);
    //console.log("person by id found...", personById);
    if (personById) {
      return personById;
    } else {
      return "Person not found.";
    }
  } else {
    return "No result is returned from the Server you are requesting data from!";
  }
};

const sameJobTitle = async (jobTitle) => {
  if (!jobTitle) throw "No Job Title is provided.";
  if (typeof jobTitle !== "string")
    throw `Parameter jobtitle ( ${jobTitle} ) is not of type string.`;
  if (jobTitle.trim().length === 0)
    throw "Provided Job Title just contains empty spaces.";

  const resultByJobTitle = await getPeople();
  //console.log(resultByJobTitle);
  if (resultByJobTitle || resultByJobTitle !== undefined) {
    let personByJobTitle = [];
    resultByJobTitle.forEach((i) => {
      if (i.job_title.toLowerCase() === jobTitle.toLowerCase()) {
        personByJobTitle.push(i);
      }
    });
    //console.log(personByJobTitle.length)
    if (personByJobTitle.length >= 2) {
      return personByJobTitle;
    } else {
      throw `No two or more people have same job title as: ${jobTitle}.`;
    }
  } else {
    return "No result is returned from the Server you are requesting data from!";
  }
};

const getPostalCodes = async (city, state) => {
  if (!city || !state) throw `Either City or State is not provided.`;
  if (typeof city !== "string" || typeof state !== "string")
    throw `Either City (${city}) or State (${state}) is not of proper type string.`;
  if (city.trim().length === 0 || state.trim().length === 0)
    throw "Either provided City or State are just empty spaces.";

  const result = await getPeople();
  if (result || result !== undefined) {
    let postalCodes = [];
    result.forEach((i) => {
      if (
        i.city.toLowerCase() === city.toLowerCase() &&
        i.state.toLowerCase() === state.toLowerCase()
      ) {
        postalCodes.push(Number(i.postal_code));
      }
    });
    if (postalCodes.length > 0) {
      return postalCodes.sort();
    } else {
      throw `There are no postal_codes for the given city and state combination.`;
    }
  } else {
    return "No result is returned from the Server you are requesting data from!";
  }
};

const sameCityAndState = async (city, state) => {
  if (!city || !state) throw `Either City or State is not provided.`;
  if (typeof city !== "string" || typeof state !== "string")
    throw `Either City (${city}) or State (${state}) is not of proper type string.`;
  if (city.trim().length === 0 || state.trim().length === 0)
    throw "Either provided City or State are just empty spaces.";

  const result = await getPeople();
  if (result || result !== undefined) {
    let peopleFirstName = [];
    let peopleLastName = [];
    //sorting the people array initially 
    result.sort(function(a, b) {
      let firstCharA = a.last_name.charAt(0);
      let firstCharB = b.last_name.charAt(0);
      if (firstCharA > firstCharB) {
        return 1;
      } else if(firstCharA < firstCharB) {
        return -1;
      } else{
        return 0;
      }
    });
    //console.log(result);
    result.forEach((i) => {
      if (
        i.city.toLowerCase() === city.toLowerCase() &&
        i.state.toLowerCase() === state.toLowerCase()
      ) {
        peopleFirstName.push(i.first_name);
        peopleLastName.push(i.last_name);
      }
    });
    if (peopleFirstName.length >= 2 && peopleLastName.length >= 2) {
      let finalOutput = [];
      for (let i = 0; i < peopleFirstName.length; i++) {
        finalOutput.push(peopleFirstName[i].concat(" ").concat(peopleLastName[i]));
        //finalOutput.push(...peopleFirstName[i],...peopleLastName[i]);
      }
      return finalOutput;
    } else {
      throw `There are not two people who live in the same city and state`;
    }
  } else {
    return "No result is returned from the Server you are requesting data from!";
  }
};

module.exports = {
  //getPeople,
  getPersonById,
  sameJobTitle,
  getPostalCodes,
  sameCityAndState,
};
