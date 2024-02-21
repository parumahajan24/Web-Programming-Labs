
const express = require("express");
const app = express();
app.use(express.json());
const { configRoutes } = require("./routes");

configRoutes(app);

app.listen(3000, () => {
  console.log("Your server has been initiated successfully...");
  console.log("Your routes will be running on http://localhost:3000");
});
