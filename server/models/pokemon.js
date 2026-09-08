const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
    // nome: {tipo: number, string }
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    level: {
        type: Number,
        default: 1,
    },
});

module.exports = mongoose.model("Pokemon", pokemonSchema);