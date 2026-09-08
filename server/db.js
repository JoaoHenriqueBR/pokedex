const moongose = require("mongoose");

const URL = process.env.ATLAS_URL;

async function connectDB() {
    try {
        await moongose.connect(URL);
        console.log("Você conectou com sucesso no MongoDB!")
        console.log("Banco conectado: ", moongose.connection.name);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;