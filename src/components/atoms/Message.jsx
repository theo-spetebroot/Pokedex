const STYLES = {
    info: "py-12 text-center text-slate-500",
    erreur: "rounded-lg bg-red-50 p-4 text-red-700 ring-1 ring-red-200",
};

// Message d'état (chargement, liste vide, erreur) partagé par toutes les pages
function Message({ type = "info", children }) {
    return <p className={STYLES[type]}>{children}</p>;
}

export default Message;
