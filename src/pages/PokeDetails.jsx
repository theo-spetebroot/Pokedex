import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../services/api";
import TypeBadge from "../components/TypeBadge";

function PokeDetails() {
    const { id } = useParams();                         // id du pokémon dans l'URL
    const [resultat, setResultat] = useState(null);     // Résultat du dernier GET : { id, pokemon, erreur }

    // Chargement tant que le résultat ne correspond pas à l'id de l'URL
    const isLoading = resultat?.id !== id;
    const pokemon = isLoading ? null : resultat.pokemon;
    const erreur = isLoading ? null : resultat.erreur;

    useEffect(() => {
        api.get(`/pokemon/${id}`)
            .then((res) => {
                setResultat({ id, erreur: null, pokemon: {
                    id: res.data.id,
                    nom: res.data.name,
                    elements: res.data.types.map((t) => t.type.name),
                    image: res.data.sprites.other["official-artwork"].front_default ?? res.data.sprites.front_default,
                    poids: res.data.weight / 10,                // PokeAPI donne le poids en hectogrammes
                    taille: res.data.height / 10,               // et la taille en décimètres
                    capacites: res.data.abilities.map((a) => a.ability.name),
                    stats: res.data.stats.map((s) => ({ nom: s.stat.name, valeur: s.base_stat })),
                } });
            })
            .catch(() => {
                setResultat({ id, pokemon: null, erreur: "Pokémon introuvable" });
            });
    }, [id]); // Relance le GET à chaque changement d'id

    if (isLoading) return <p className="py-12 text-center text-slate-500">Chargement...</p>;
    if (erreur) return <p className="rounded-lg bg-red-50 p-4 text-red-700 ring-1 ring-red-200">Erreur : {erreur}</p>;
    if (!pokemon) return null;

    return (
        <div>
            <Link to="/" className="text-sm text-red-600 hover:underline">← Retour à la liste</Link>
            <div className="mt-4 grid gap-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
                <div className="flex items-center justify-center rounded-xl bg-slate-50">
                    <img src={pokemon.image} alt={pokemon.nom} className="w-64" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-400">#{String(pokemon.id).padStart(3, "0")}</p>
                    <h1 className="mb-3 text-3xl font-bold capitalize">{pokemon.nom}</h1>
                    <div className="mb-6 flex gap-2">
                        {pokemon.elements.map((element) => <TypeBadge key={element} element={element} />)}
                    </div>

                    <dl className="mb-6 grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-slate-50 p-3">
                            <dt className="text-xs text-slate-500">Poids</dt>
                            <dd className="font-semibold">{pokemon.poids} kg</dd>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                            <dt className="text-xs text-slate-500">Taille</dt>
                            <dd className="font-semibold">{pokemon.taille} m</dd>
                        </div>
                        <div className="col-span-2 rounded-lg bg-slate-50 p-3">
                            <dt className="text-xs text-slate-500">Capacités</dt>
                            <dd className="font-semibold capitalize">{pokemon.capacites.join(", ")}</dd>
                        </div>
                    </dl>

                    <h2 className="mb-3 text-lg font-semibold">Statistiques</h2>
                    <ul className="space-y-2">
                        {pokemon.stats.map((stat) => (
                            <li key={stat.nom} className="grid grid-cols-[8rem_2.5rem_1fr] items-center gap-2 text-sm">
                                <span className="capitalize text-slate-500">{stat.nom}</span>
                                <span className="text-right font-semibold">{stat.valeur}</span>
                                {/* Barre proportionnelle à la stat (255 = maximum dans les jeux) */}
                                <span className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <span className="block h-full rounded-full bg-red-500" style={{ width: `${Math.min(stat.valeur / 255, 1) * 100}%` }} />
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PokeDetails;
