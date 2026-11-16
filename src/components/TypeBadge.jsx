// Couleur de fond associée à chaque élément (nom renvoyé par PokeAPI)
const COULEURS = {
    normal: "bg-stone-400",
    fire: "bg-orange-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400 text-slate-800",
    grass: "bg-green-500",
    ice: "bg-cyan-400",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-amber-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-700",
    ghost: "bg-violet-700",
    dragon: "bg-indigo-700",
    dark: "bg-stone-700",
    steel: "bg-slate-500",
    fairy: "bg-pink-300 text-slate-800",
};

function TypeBadge({ element }) {
    const couleur = COULEURS[element] ?? "bg-slate-400";
    return (
        <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold capitalize text-white ${couleur}`}>
            {element}
        </span>
    );
}

export default TypeBadge;
