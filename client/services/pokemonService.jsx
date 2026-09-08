import axios from "axios";

export async function listPokemon() {
    const { data } = await axios.get("http://localhost:8000/api/pokemon");
    return data;
}