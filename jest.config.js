export default {
    // Environnement Node par défaut, comme dans le cours : les tests qui ont besoin du DOM
    // l'indiquent avec le commentaire @jest-environment jsdom en haut du fichier
    testEnvironment: "node",
    setupFiles: ["<rootDir>/jest.polyfills.js"],
    // Babel convertit aussi les fichiers .mjs (format ESM de certaines dépendances)
    transform: { "\\.m?jsx?$": "babel-jest" },
    // react-router et ses dépendances ne sont publiés qu'en ESM : on demande à Babel de les convertir pour Jest
    transformIgnorePatterns: ["/node_modules/(?!(react-router|@remix-run|cookie-es)/)"],
};
