const  axios = require('axios');

async function getPokemonData() {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon');
   // console.log("data from site..", data);
    return data;
  }

async function getPokemonDataById(id) {
    //console.log('inside getby id.')
    let numberId = Number(id);

    let stringArray = id.split('.');
   // console.log('string array inside getById..',stringArray);
    for(let i=0;i<stringArray.length;i++){
      if(Number(stringArray[i+1]) === 0){
        throw 'Invalid URL Parameter.';
      }
    }
    //console.log('after stringarray')

    if (isNaN(numberId)) {
     throw "Invalid URL Parameter. NaN";
    }
    if (numberId < 0) {
      throw 'Invalid URL Parameter.<0';
    }

    if (numberId - Math.trunc(numberId) > 0) {
      throw  "Invalid URL Parameter.Not Dec";
    }

    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/'+id);
    //console.log('parul this is the data..',data);
    
    if(data || data !== undefined){
        return data;
    }else{
        throw 'no result from the server.'
    }
}

module.exports = {
    getPokemonData,
    getPokemonDataById,
}