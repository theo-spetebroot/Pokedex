// Utilisé uniquement par Jest (Vite compile le JSX lui-même)

// react-router utilise import.meta, qui n'existe pas en CommonJS (format utilisé par Jest) :
// on le remplace par un objet vide, ses propriétés valent alors undefined
function importMetaVide({ types: t }) {
    return {
        visitor: {
            MetaProperty(path) {
                if (path.node.meta.name === "import") path.replaceWith(t.objectExpression([]));
            },
        },
    };
}

module.exports = {
    presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        ["@babel/preset-react", { runtime: "automatic" }],
    ],
    plugins: [importMetaVide],
};
