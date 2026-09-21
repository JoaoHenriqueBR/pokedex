const Pokemon = require("../models/pokemon");

async function createPokemon(req, res) {
  try {
    const { name, type, level } = req.body;

    const newPokemon = new Pokemon({
      name,
      type,
      level,
    });

    const savedPokemon = await newPokemon.save();
    res.status(201).json(savedPokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function listPokemon(req, res) {
  try {
    const pokemons = await Pokemon.find();
    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar Pokemons" });
  }
}

async function updatePokemon(req, res) {
  try {
    const updated = await Pokemon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function deletePokemon(req, res) {
  try {
    await Pokemon.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Pokemon deletado com sucesso." });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function getPokemonById(req, res) {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) {
      return res.status(404).json({ mensagem: "Pokemon não encontrado."})
    }
    res.status(200).json(pokemon)
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

module.exports = { listPokemon, createPokemon, updatePokemon, deletePokemon, getPokemonById };
