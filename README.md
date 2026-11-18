# Mon Pokédex

Application React qui affiche les pokémons de [PokeAPI](https://pokeapi.co/) : liste paginée, fiche détail avec commentaires et formulaire d'ajout.

- **Site en ligne :** https://app-de-fou.vercel.app/
- **Dépôt :** https://github.com/Tidragon-coder/appDeFou

## Stack

| Outil | Rôle |
|---|---|
| React 19 + Vite 8 | Interface et build |
| React Router 8 | Navigation entre les pages |
| TanStack Query 5 | État serveur : cache, chargement, erreurs, préchargement |
| Axios | Appels HTTP vers l'API REST |
| Tailwind CSS 4 | Mise en forme |
| Jest + React Testing Library | Tests unitaires et fonctionnels |
| Oxlint | Lint |
| GitHub Actions + Vercel | CI/CD |

## Lancer le projet

```bash
npm install
npm run dev      # serveur de développement
npm run lint     # vérification du code
npm test         # tests Jest
npm run build    # build de production dans dist/
```

## Tests

Les tests utilisent **Jest** et **Testing Library**. Chaque fichier de test est placé à côté du code qu'il teste. L'API est simulée avec `jest.mock` et les réponses de [src/data/mock-pokeapi-data.js](src/data/mock-pokeapi-data.js) : les tests n'appellent jamais la vraie PokeAPI.

Les tests qui ont besoin du DOM commencent par le commentaire `@jest-environment jsdom`. Ils récupèrent les éléments avec les queries de `@testing-library/dom` (`getByTestId`, `getByPlaceholderText`…), grâce aux attributs `data-testid` ajoutés dans les composants.

| Fichier | Type | Ce qui est vérifié |
|---|---|---|
| [services/pokemons.unit.test.js](src/services/pokemons.unit.test.js) | Unitaire (2) | `getNumberOfPages` calcule le nombre de pages. `pokemonQuery` convertit les unités de PokeAPI (hg → kg, dm → m) |
| [components/molecules/Pagination.integration.test.jsx](src/components/molecules/Pagination.integration.test.jsx) | Intégration (2) | Le bouton « Précédent » est désactivé sur la page 1. Le clic sur « Suivant » appelle le callback |
| [components/atoms/TypeBadge.test.jsx](src/components/atoms/TypeBadge.test.jsx) | Snapshot (1) | Le HTML du badge ne change pas sans qu'on le voie |
| [App.test.jsx](src/App.test.jsx) | Fonctionnel (2) | Le routeur affiche la bonne page pour `/` et `/poke/1` |
| [pages/AddPokemon.test.jsx](src/pages/AddPokemon.test.jsx) | Fonctionnel (1) | L'utilisateur remplit le formulaire, et le `POST` envoyé contient les bonnes valeurs |
| [components/organisms/Comments.test.jsx](src/components/organisms/Comments.test.jsx) | Fonctionnel (1) | L'utilisateur poste un commentaire : il s'affiche dans la liste et il est enregistré dans le localStorage |

Les tests tournent aussi dans la CI, entre le lint et le build.

**Configuration** ([jest.config.js](jest.config.js), [babel.config.cjs](babel.config.cjs)) : Jest fonctionne en CommonJS, alors que React Router 8 n'est publié qu'en ESM. Babel convertit donc le JSX du projet, mais aussi `react-router` et ses dépendances (`transformIgnorePatterns`). Un petit plugin remplace `import.meta`, qui n'existe pas en CommonJS. Vite n'utilise pas cette configuration Babel.

## Fonctionnalités

- **Liste des pokémons** (`/`) : 10 pokémons par page, avec pagination précédent / suivant.
- **Fiche détail** (`/poke/:id`) : image, éléments, poids, taille, capacités et statistiques.
- **Commentaires** sur chaque fiche détail : formulaire (nom + commentaire), enregistrés dans le `localStorage` du navigateur. Ils sont conservés après un rechargement de la page.
- **Ajout d'un pokémon** (`/add`) : formulaire contrôlé qui envoie un `POST` via Axios, puis redirige vers l'accueil.
- **Menu global** présent sur toutes les pages, avec mise en évidence de la page active.
- **États d'affichage** : chargement, erreur et liste vide.

> **Limite connue :** PokeAPI est une API en lecture seule. Le `POST` du formulaire d'ajout est bien envoyé, mais l'API le refuse et un message d'erreur s'affiche.

## Déploiement et CI/CD

- **CI** ([.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)) : à chaque push sur `master` et à chaque pull request, GitHub Actions installe les dépendances (`npm ci`), lance le lint, les tests puis le build. Si une étape échoue, la PR est marquée en échec.
- **CD** : l'intégration GitHub de Vercel déploie automatiquement. Chaque push sur `master` part en production, et chaque pull request a son URL de preview.
- [vercel.json](vercel.json) redirige toutes les URL vers `index.html`. Sans ça, recharger la page sur `/poke/25` renverrait une erreur 404, puisque le routage se fait côté navigateur.

## Stratégie de rendu

L'application utilise le **rendu côté client (CSR)** sous la forme d'une **SPA**, avec du **code splitting par route** et du **préchargement des données** :

1. Vite génère au build un `index.html` presque vide et des fichiers JS séparés : un bundle principal, puis un fichier par page (`Home`, `PokeDetails`, `AddPokemon`).
2. Vercel sert ces fichiers statiques depuis son CDN.
3. Dans le navigateur, React affiche le menu (template `Layout`), puis télécharge **seulement le code de la page demandée**, grâce à `React.lazy` dans [App.jsx](src/App.jsx). Pendant ce temps, `<Suspense>` affiche « Chargement... ».
4. Les données sont récupérées après l'affichage avec TanStack Query, puis gardées en cache.
5. Les données de la prochaine vue sont **préchargées avant d'en avoir besoin** : la page suivante de la liste, et la fiche détail d'un pokémon dès que la souris passe sur sa carte.

Ce choix convient à un Pokédex : il n'y a ni contenu privé ni besoin fort de référencement, et l'hébergement reste gratuit et simple. Une évolution possible serait un framework SSR/SSG (Next.js, React Router en mode framework) qui pré-génèrerait les fiches pokémon pour le SEO et le premier affichage.

## Organisation du code (Atomic Design)

```
src/
├── main.jsx                      → point d'entrée : QueryClientProvider + BrowserRouter
├── App.jsx                       → déclaration des routes (pages chargées en lazy)
├── components/
│   ├── atoms/
│   │   ├── TypeBadge.jsx         → badge coloré d'un élément
│   │   └── Message.jsx           → message d'état (chargement, vide, erreur)
│   ├── molecules/
│   │   ├── PokeCard.jsx          → carte : image + nom + TypeBadge + lien
│   │   └── Pagination.jsx        → boutons précédent / suivant + compteur
│   ├── organisms/
│   │   ├── Header.jsx            → en-tête avec le menu de navigation global
│   │   └── Comments.jsx          → liste + formulaire des commentaires d'un pokémon
│   └── templates/
│       └── Layout.jsx            → structure des pages : Header + <Suspense> + <Outlet>
├── pages/
│   ├── Home.jsx                  → liste paginée
│   ├── PokeDetails.jsx           → fiche détail
│   └── AddPokemon.jsx            → formulaire d'ajout
└── services/
    ├── api.js                    → instance Axios partagée
    ├── comments.js               → lecture / écriture des commentaires dans le localStorage
    └── pokemons.js               → requêtes TanStack Query + conversion des données PokeAPI
```

Chaque dossier de `components/` correspond à un niveau de l'**Atomic Design**, et un composant n'importe que des niveaux inférieurs au sien :

- **Atomes** : les plus petits éléments, sans logique ni appel réseau (`TypeBadge`, `Message`).
- **Molécules** : des assemblages d'atomes qui ont un rôle précis (`PokeCard` utilise `TypeBadge`).
- **Organismes** : des blocs complets de l'interface (`Header`, `Comments`).
- **Templates** : la mise en page commune, sans données (`Layout`).
- **Pages** : elles récupèrent les données et assemblent les composants.

Les appels réseau sont isolés dans `services/`. Ce n'est pas un niveau de l'Atomic Design, mais cette couche est reprise du **Feature-Sliced Design** : les composants ne savent pas d'où viennent les données, et l'URL de l'API comme le format de PokeAPI ne sont connus que de ce dossier.

## Notions appliquées

### Performances

- **Code splitting par route** : `React.lazy` et `Suspense` dans [App.jsx](src/App.jsx) et [Layout.jsx](src/components/templates/Layout.jsx). Le visiteur ne télécharge que le code de la page qu'il ouvre.
- **Cache des requêtes** : avec TanStack Query (`staleTime` de 5 minutes, réglé dans [main.jsx](src/main.jsx)), revenir sur une page ou une fiche déjà vue n'entraîne aucun nouvel appel réseau.
- **Préchargement** :
  - la page suivante de la liste est chargée en arrière-plan ([Home.jsx](src/pages/Home.jsx)) ;
  - la fiche détail est chargée dès qu'on survole une carte ([PokeCard.jsx](src/components/molecules/PokeCard.jsx)).
- **Images en lazy loading** : `loading="lazy"`, avec une taille fixe pour éviter que la page saute pendant le chargement.
- **Requêtes en parallèle** : les détails des 10 pokémons d'une page sont chargés en même temps avec `Promise.all`.
- **Pagination côté API** : seuls 10 pokémons sont demandés à chaque page (`offset` / `limit`).

### KISS et qualité du code

- **Une seule source pour l'accès aux données** :
  - [services/pokemons.js](src/services/pokemons.js) contient les requêtes et convertit les réponses de PokeAPI (poids en kg, taille en m…) ;
  - les pages ne font qu'appeler `useQuery(pokemonsQuery(page))` et afficher le résultat.
- **Pas de code dupliqué** : le message de chargement ou d'erreur est un atome unique (`Message`), et le menu est un organisme unique (`Header`).
- **Moins de code à maintenir** : TanStack Query remplace les `useState` de chargement et d'erreur ainsi que les `useEffect` écrits à la main.
- **Code mort supprimé** : ancien composant `Pokemon.jsx` des TP 1 et 2, images et CSS du template Vite.
- **Lint automatique** (Oxlint) en local et dans la CI : un code qui ne passe pas le lint ne peut pas être fusionné.

### Gestion d'état moderne

L'application sépare **état serveur** et **état client**, qui n'ont pas les mêmes besoins :

- **État serveur → TanStack Query** : les données de PokeAPI sont gérées par `useQuery` (lecture) et `useMutation` (ajout).
  - Le cache est partagé entre les pages.
  - Les états `isPending` et `isError` sont fournis par la bibliothèque.
  - `keepPreviousData` garde la liste affichée pendant le changement de page.
  - Les réponses en retard ne peuvent plus écraser une page plus récente, puisque chaque page a sa propre clé de cache.
- **État persistant côté navigateur → `localStorage` + TanStack Query** : les commentaires sont lus par `useQuery(commentsQuery(id))` et ajoutés par `useMutation`. Après l'ajout, `setQueryData` met à jour le cache, donc la liste se met à jour tout de suite sans relire le stockage. Le reste de l'app ne sait pas que les données viennent du `localStorage` et pas d'une API : on pourrait passer à une vraie API en ne modifiant que [services/comments.js](src/services/comments.js).
- **État client → `useState`** : seulement ce qui appartient à l'interface, comme la page courante ou les champs du formulaire (formulaire contrôlé).
- **L'URL comme source d'état** : l'id du pokémon affiché vient de l'URL (`useParams`) et sert de clé de cache. Une fiche peut donc être partagée ou rechargée directement.
