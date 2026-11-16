import { Routes, Route, NavLink } from "react-router";
import Home from "./pages/Home";
import PokeDetails from "./pages/PokeDetails";
import AddPokemon from "./pages/AddPokemon";

// Style des liens du menu : surligné quand la page est active
const lienClasses = ({ isActive }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${isActive ? "bg-white/20" : "hover:bg-white/10"}`;

function App() {
    return (
        <div className="min-h-svh">
            {/* Menu de navigation */}
            <header className="bg-red-600 text-white shadow-md">
                <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    <NavLink to="/" className="text-xl font-bold tracking-tight">Mon Pokédex</NavLink>
                    <div className="flex gap-2">
                        <NavLink to="/" end className={lienClasses}>Accueil</NavLink>
                        <NavLink to="/add" className={lienClasses}>Ajouter un pokémon</NavLink>
                    </div>
                </nav>
            </header>

            {/* Routes principales */}
            <main className="mx-auto max-w-5xl px-4 py-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/poke/:id" element={<PokeDetails />} />
                    <Route path="/add" element={<AddPokemon />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
