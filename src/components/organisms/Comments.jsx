import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, commentsQuery } from "../../services/comments";

const champClasses = "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200";

// Liste des commentaires d'un pokémon + formulaire d'ajout
function Comments({ pokemonId }) {
    const [auteur, setAuteur] = useState("");           // Champs du formulaire
    const [texte, setTexte] = useState("");
    const queryClient = useQueryClient();
    const { data: commentaires = [] } = useQuery(commentsQuery(pokemonId));

    const ajout = useMutation({
        mutationFn: async (commentaire) => addComment({ pokemonId, ...commentaire }),
        onSuccess: (commentaire) => {
            // Met à jour le cache directement : la liste s'affiche sans relire le localStorage
            queryClient.setQueryData(commentsQuery(pokemonId).queryKey, (anciens = []) => [...anciens, commentaire]);
            setTexte("");
        },
    });

    function handleSubmit(e) {
        e.preventDefault();                             // Empêche le rechargement de la page
        ajout.mutate({ auteur: auteur.trim(), texte: texte.trim() });
    }

    return (
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-lg font-semibold">Commentaires ({commentaires.length})</h2>

            {commentaires.length === 0 ? (
                <p className="mb-6 text-sm text-slate-500">Aucun commentaire pour le moment.</p>
            ) : (
                <ul data-testid="comments-list" className="mb-6 space-y-3">
                    {commentaires.map((c) => (
                        <li key={c.id} className="rounded-lg bg-slate-50 p-3">
                            <p className="text-sm">
                                <span className="font-semibold">{c.auteur}</span>
                                <span className="ml-2 text-xs text-slate-400">{new Date(c.date).toLocaleDateString("fr-FR")}</span>
                            </p>
                            <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{c.texte}</p>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" value={auteur} onChange={(e) => setAuteur(e.target.value)} placeholder="Votre nom" required maxLength={50} className={champClasses} />
                <textarea value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Votre commentaire" required maxLength={500} rows={3} className={champClasses} />
                <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700">
                    Commenter
                </button>
            </form>
        </section>
    );
}

export default Comments;
