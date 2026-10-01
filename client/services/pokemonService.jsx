import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    timeout: 10000,
});

export async function listPokemon() {
    const { data } = await api.get("/pokemon");
    if (!Array.isArray(data)) throw new Error("Resposta inválida ao carregar a coleção.");
    return data;
}

export async function createPokemon(body) {
    const { data } = await api.post("/pokemon", body);
    return data;
}

export async function getPokemon(id) {
 const { data } = await api.get(`/pokemon/${id}`);
 return data;
}

export async function updatePokemon(id, body) {
 const { data } = await api.patch(`/pokemon/${id}`, body);
 return data;
}

