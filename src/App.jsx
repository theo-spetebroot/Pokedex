import { lazy } from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/templates/Layout";

// Chaque page est un fichier JS séparé, téléchargé seulement quand on visite la route
const Home = lazy(() => import("./pages/Home"));
const PokeDetails = lazy(() => import("./pages/PokeDetails"));
const AddPokemon = lazy(() => import("./pages/AddPokemon"));

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/poke/:id" element={<PokeDetails />} />
                <Route path="/add" element={<AddPokemon />} />
            </Route>
        </Routes>
    );
}

export default App;
