import { NavLink } from "react-router";

// Style des liens du menu : surligné quand la page est active
const lienClasses = ({ isActive }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${isActive ? "bg-white/20" : "hover:bg-white/10"}`;

function Header() {
    return (
        <header className="bg-red-600 text-white shadow-md">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <NavLink to="/" className="text-xl font-bold tracking-tight">Mon Pokédex</NavLink>
                <div className="flex gap-2">
                    <NavLink to="/" end className={lienClasses}>Accueil</NavLink>
                    <NavLink to="/add" className={lienClasses}>Ajouter un pokémon</NavLink>
                </div>
            </nav>
        </header>
    );
}

export default Header;
