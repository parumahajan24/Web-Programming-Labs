const pokemonRoutes = require("./pokemon");

const configRoutes = (app) => {
  app.use("/", pokemonRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found." });
  });
};

module.exports = {
  configRoutes
};
