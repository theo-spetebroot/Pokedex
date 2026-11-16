/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { findByTestId } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "./services/api";
import { mockApiGet } from "./data/mock-pokeapi-data";
import App from "./App";

jest.mock("./services/api", () => ({ __esModule: true, default: { get: jest.fn() } }));

/**
 * Affiche l'application à une URL donnée, avec les mêmes providers que main.jsx
 * @param {string} path
 */
const renderApp = (path) => render(
    <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[path]}>
            <App />
        </MemoryRouter>
    </QueryClientProvider>
);

// Les pages sont chargées en lazy : leur code peut mettre plus d'une seconde à arriver la première fois
const WAIT = { timeout: 10000 };
jest.setTimeout(15000);

beforeEach(() => {
    api.get.mockImplementation(mockApiGet);
});

describe("Router Integration Test Suites", () => {
    it('should render the home page when the path "/" is loaded', async () => {
        renderApp("/");

        expect(await findByTestId(document.body, "home-title", {}, WAIT)).toHaveTextContent("Liste des pokémons");
    });

    it('should render the details page when the path "/poke/1" is loaded', async () => {
        renderApp("/poke/1");

        expect(await findByTestId(document.body, "poke-details-title", {}, WAIT)).toHaveTextContent("bulbasaur");
    });
});
