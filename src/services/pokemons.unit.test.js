import api from "./api";
import { getNumberOfPages, pokemonQuery } from "./pokemons";
import { mockApiGet } from "../data/mock-pokeapi-data";

// On remplace l'instance Axios : aucun appel réseau pendant les tests
jest.mock("./api", () => ({ __esModule: true, default: { get: jest.fn() } }));

beforeEach(() => {
    api.get.mockImplementation(mockApiGet);
});

/**
 * @function getNumberOfPages
 */
describe("getNumberOfPages Unit Test Suites", () => {
    it("should return 4 pages for 34 pokemons", () => {
        expect(getNumberOfPages(34)).toEqual(4);
    });
});

/**
 * @function pokemonQuery
 */
describe("pokemonQuery Unit Test Suites", () => {
    it("should convert PokeAPI units to kg and m", async () => {
        const pokemon = await pokemonQuery(1).queryFn();

        expect(pokemon.poids).toBe(6.9);
        expect(pokemon.taille).toBe(0.7);
        expect(pokemon.elements).toContain("poison");
    });
});
