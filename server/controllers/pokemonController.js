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
    } catch(error) {
        res.status(400).json({ message: error.message })
    }
}

async function listPokemon(req, res) {
    try {
        const pokemons = await Pokemon.find();
        res.status(200).json(pokemons);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar Pokemons"});
    }
}

module.exports = { listPokemon, createPokemon };