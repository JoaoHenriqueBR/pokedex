const express = require("express");
const cors = require("cors");

require('dotenv').config();

const pokemonRoutes = require("./routes/pokemonRoutes")

const connectDB = require("./db");

const PORT = process.env.PORT || 8000;
const BETA = process.env.BETA;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use("/api", pokemonRoutes)

connectDB();


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escutando a porta ${PORT}`);
    console.log(`Quanto sobra para o Beta? ${BETA}`)
  });
}

module.exports = app;



