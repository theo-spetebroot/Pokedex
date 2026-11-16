import TypeBadge from "./TypeBadge";

function Pokemon({ nom, element, image }) {
    return (
        <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <img src={image} alt={nom} className="h-24 w-24" />
            <h3 className="mt-2 mb-2 font-semibold capitalize">{nom}</h3>
            <TypeBadge element={element} />
        </div>
    );
}

export default Pokemon;
