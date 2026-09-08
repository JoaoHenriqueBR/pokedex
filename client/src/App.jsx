import { BrowserRouter, Routes, Route } from "react-router-dom";
import PokemonList from "./pages/pokemonList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PokemonList />} />
      </Routes>
    </BrowserRouter>
  );

}
