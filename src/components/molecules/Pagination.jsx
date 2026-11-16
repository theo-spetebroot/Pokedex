const boutonClasses = "rounded-lg bg-white px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

function Pagination({ page, nbPages, onPrecedent, onSuivant }) {
    return (
        <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={onPrecedent} disabled={page <= 1} className={boutonClasses}>◀ Précédent</button>
            <span className="text-sm text-slate-600">Page {page} / {nbPages || "…"}</span>
            <button onClick={onSuivant} disabled={page >= nbPages} className={boutonClasses}>Suivant ▶</button>
        </div>
    );
}

export default Pagination;
