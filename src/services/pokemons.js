import api from "./api";

export const LIMIT = 10;   // Nombre de pokémons par page

/**
 * Nombre de pages nécessaires pour afficher tous les pokémons
 * @param {number} numberOfPokemons
 * @returns {number}
 */
export const getNumberOfPages = (numberOfPokemons) => Math.ceil(numberOfPokemons / LIMIT);

// Requêtes TanStack Query : une clé de cache + la fonction qui va chercher les données.
// Toute la conversion PokeAPI → objets de l'app est centralisée ici, les composants n'affichent que le résultat.

export function pokemonsQuery(page) {
    return {
        queryKey: ["pokemons", page],
        // PokeAPI pagine avec offset/limit : page 1 → offset 0, page 2 → offset 10...
        queryFn: () => api.get("/pokemon", { params: { offset: (page - 1) * LIMIT, limit: LIMIT } })
            .then((res) =>
                // La liste ne contient que nom + url : on récupère le détail de chaque pokémon en parallèle
                Promise.all(res.data.results.map((p) => api.get(p.url)))
                    .then((details) => ({
                        total: res.data.count,
                        pokemons: details.map(({ data }) => ({
                            id: data.id,
                            nom: data.name,
                            element: data.types[0].type.name,
                            image: data.sprites.front_default,
                        })),
                    }))
            ),
    };
}

export function pokemonQuery(id) {
    return {
        queryKey: ["pokemon", String(id)],
        queryFn: () => api.get(`/pokemon/${id}`)
            .then(({ data }) => ({
                id: data.id,
                nom: data.name,
                elements: data.types.map((t) => t.type.name),
                image: data.sprites.other["official-artwork"].front_default ?? data.sprites.front_default,
                poids: data.weight / 10,                // PokeAPI donne le poids en hectogrammes
                taille: data.height / 10,               // et la taille en décimètres
                capacites: data.abilities.map((a) => a.ability.name),
                stats: data.stats.map((s) => ({ nom: s.stat.name, valeur: s.base_stat })),
            })),
    };
}
