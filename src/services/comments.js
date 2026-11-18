// Commentaires enregistrés dans le navigateur (localStorage), regroupés par id de pokémon :
// { "25": [{ id, auteur, texte, date }], ... }
const STORAGE_KEY = "pokedex-commentaires";

function lireTout() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
    } catch {
        return {};                                      // Stockage vide, illisible ou bloqué
    }
}

// Requête TanStack Query : la "source" des données est le localStorage au lieu d'une API
export function commentsQuery(pokemonId) {
    return {
        queryKey: ["commentaires", String(pokemonId)],
        queryFn: () => lireTout()[pokemonId] ?? [],
        staleTime: Infinity,                            // Seule l'app modifie ces données : pas besoin de les relire
    };
}

/**
 * Ajoute un commentaire au pokémon et le sauvegarde dans le localStorage
 * @returns {object} le commentaire créé
 */
export function addComment({ pokemonId, auteur, texte }) {
    const tous = lireTout();
    const commentaire = { id: Date.now(), auteur, texte, date: new Date().toISOString() };
    tous[pokemonId] = [...(tous[pokemonId] ?? []), commentaire];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tous));
    return commentaire;
}
