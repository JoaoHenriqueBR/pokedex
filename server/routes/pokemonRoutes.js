const express = require("express");
const pokemonController = require("../controllers/pokemonController")

const router = express.Router();

router.post("/pokemon", pokemonController.createPokemon);

router.get("/pokemon", pokemonController.listPokemon);

module.exports = router;