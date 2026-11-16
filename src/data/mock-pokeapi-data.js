// Réponses PokeAPI simplifiées, utilisées par les tests à la place de la vraie API

export const data = {
    list: {
        count: 2,
        results: [
            { name: "bulbasaur", url: "/pokemon/1" },
            { name: "charmander", url: "/pokemon/4" },
        ],
    },
    bulbasaur: {
        id: 1,
        name: "bulbasaur",
        types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
        sprites: { front_default: "bulbasaur.png", other: { "official-artwork": { front_default: "bulbasaur-hd.png" } } },
        weight: 69,
        height: 7,
        abilities: [{ ability: { name: "overgrow" } }],
        stats: [{ stat: { name: "hp" }, base_stat: 45 }],
    },
    charmander: {
        id: 4,
        name: "charmander",
        types: [{ type: { name: "fire" } }],
        sprites: { front_default: "charmander.png", other: { "official-artwork": { front_default: null } } },
        weight: 85,
        height: 6,
        abilities: [{ ability: { name: "blaze" } }],
        stats: [{ stat: { name: "hp" }, base_stat: 39 }],
    },
};

/**
 * Remplace api.get : renvoie la réponse simulée correspondant à l'URL
 * @param {string} url
 * @returns {Promise<{data: object}>}
 */
export const mockApiGet = (url) => {
    const responses = {
        "/pokemon": data.list,
        "/pokemon/1": data.bulbasaur,
        "/pokemon/4": data.charmander,
    };
    return url in responses
        ? Promise.resolve({ data: responses[url] })
        : Promise.reject(new Error("Not found"));
};
