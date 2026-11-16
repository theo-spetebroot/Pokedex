import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import Message from "../components/atoms/Message";

const champClasses = "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200";

function AddPokemon() {
    const [nom, setNom] = useState("");                 // Champs du formulaire
    const [element, setElement] = useState("");
    const [image, setImage] = useState("");
    const [poids, setPoids] = useState("");
    const [taille, setTaille] = useState("");
    const navigate = useNavigate();

    // useMutation gère l'état d'envoi et l'erreur à notre place
    const ajout = useMutation({
        mutationFn: (pokemon) => api.post("/pokemon", pokemon),
        onSuccess: () => navigate("/"),                 // Retour à l'accueil après l'ajout
    });

    function handleSubmit(e) {
        e.preventDefault();                             // Empêche le rechargement de la page
        ajout.mutate({ nom, element, image, poids: Number(poids), taille: Number(taille) });
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h1 data-testid="add-pokemon-title" className="text-2xl font-bold">Ajouter un pokémon</h1>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" required className={champClasses} />
            <input type="text" value={element} onChange={(e) => setElement(e.target.value)} placeholder="Élément" required className={champClasses} />
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL de l'image" className={champClasses} />
            <div className="grid grid-cols-2 gap-4">
                <input type="number" value={poids} onChange={(e) => setPoids(e.target.value)} placeholder="Poids (kg)" min="0" step="0.1" className={champClasses} />
                <input type="number" value={taille} onChange={(e) => setTaille(e.target.value)} placeholder="Taille (m)" min="0" step="0.1" className={champClasses} />
            </div>
            <button type="submit" disabled={ajout.isPending} className="w-full rounded-lg bg-red-600 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50">
                {ajout.isPending ? "Ajout en cours..." : "Ajouter"}
            </button>

            {ajout.isError && <Message type="erreur">Erreur lors de l'ajout du pokémon</Message>}
        </form>
    );
}

export default AddPokemon;
