import { useEffect, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNumberOfPages, pokemonsQuery } from "../services/pokemons";
import PokeCard from "../components/molecules/PokeCard";
import Pagination from "../components/molecules/Pagination";
import Message from "../components/atoms/Message";

function Home() {
    const [page, setPage] = useState(1);                // Page courante
    const queryClient = useQueryClient();

    // TanStack Query gère chargement, erreur et cache : revenir sur une page déjà vue ne refait pas d'appel.
    // keepPreviousData garde la page affichée pendant le chargement de la suivante.
    const { data, isPending, isError, error, isPlaceholderData } = useQuery({
        ...pokemonsQuery(page),
        placeholderData: keepPreviousData,
    });

    const nbPages = data ? getNumberOfPages(data.total) : 0;

    // Précharge la page suivante en arrière-plan pour que "Suivant" soit instantané
    useEffect(() => {
        if (page < nbPages) queryClient.prefetchQuery(pokemonsQuery(page + 1));
    }, [page, nbPages, queryClient]);

    return (
        <div>
            <h1 data-testid="home-title" className="mb-6 text-3xl font-bold">Liste des pokémons</h1>
            {isPending && <Message>Chargement...</Message>}
            {isError && <Message type="erreur">Erreur : {error.message}</Message>}
            {data && data.pokemons.length === 0 && <Message>Aucun pokemon disponible.</Message>}
            {data && (
                <div className={`grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 lg:grid-cols-5 ${isPlaceholderData ? "opacity-50" : ""}`}>
                    {data.pokemons.map((pokemon) => (
                        <PokeCard
                            key={pokemon.id}
                            id={pokemon.id}
                            nom={pokemon.nom}
                            element={pokemon.element}
                            image={pokemon.image}
                        />
                    ))}
                </div>
            )}
            <Pagination
                page={page}
                nbPages={nbPages}
                onPrecedent={() => setPage(page - 1)}
                onSuivant={() => setPage(page + 1)}
            />
        </div>
    );
}

export default Home;
