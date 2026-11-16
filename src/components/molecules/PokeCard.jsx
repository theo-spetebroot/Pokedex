import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { pokemonQuery } from "../../services/pokemons";
import TypeBadge from "../atoms/TypeBadge";

function PokeCard({ id, nom, element, image }) {
    const queryClient = useQueryClient();

    return (
        <Link
            to={`/poke/${id}`}
            // Précharge la fiche détail au survol : elle s'affiche instantanément au clic
            onMouseEnter={() => queryClient.prefetchQuery(pokemonQuery(id))}
            className="group flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
        >
            <span className="self-end text-xs font-medium text-slate-400">#{String(id).padStart(3, "0")}</span>
            <img src={image} alt={nom} loading="lazy" width={96} height={96} className="h-24 w-24 transition group-hover:scale-110" />
            <h3 className="mt-2 mb-2 font-semibold capitalize">{nom}</h3>
            <TypeBadge element={element} />
            <span className="mt-3 text-sm text-red-600 group-hover:underline">Voir détails</span>
        </Link>
    );
}

export default PokeCard;
