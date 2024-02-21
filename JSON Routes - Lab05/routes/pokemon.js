const express = require("express");
const router = express.Router();
const data = require("../data");
const pokemonData = data.pokemon;

router.route("/pokemon/:id").get(async (req, res) => {
  try {
    //console.log("parul isnide id function... id is...", req.params.id);
    //console.log('is not a number..', isNaN(req.params.id));
    let numberId = Number(req.params.id);

    let stringArray = req.params.id.split('.');
    //console.log('string array is..',stringArray);
    for(let i=0;i<stringArray.length;i++){
      if(Number(stringArray[i+1]) === 0){
        res.status(400).json({error: 'Invalid URL Parameter.'});
        return;
      }
    }

    if (isNaN(numberId)) {
      res.status(400).json({ error: "Invalid URL Parameter." });
      return;
    }
    if (numberId < 0) {
      res.status(400).json({ error: "Invalid URL Parameter." });
      return;
    }
    if (numberId - Math.trunc(numberId) > 0) {
      res.status(400).json({ error: "Invalid URL Parameter." });
      return;
    }

    const user = await pokemonData.getPokemonDataById(req.params.id);
    res.json(user);
  } catch (e) {
    res.status(404).json({ error: "Pokemon Not Found." });
  }
});

router.route("/pokemon").get(async (req, res) => {
  try {
    const pokemonList = await pokemonData.getPokemonData();
    res.json(pokemonList);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
