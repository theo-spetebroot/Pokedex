/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { getByPlaceholderText, getByRole } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "../services/api";
import AddPokemon from "./AddPokemon";

jest.mock("../services/api", () => ({ __esModule: true, default: { post: jest.fn() } }));

beforeEach(() => {
    api.post.mockResolvedValue({ data: {} });
    render(
        <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter>
                <AddPokemon />
            </MemoryRouter>
        </QueryClientProvider>
    );
});

describe("Add Pokemon Form Test Suites", () => {
    it("should send the filled form to the API", async () => {
        const $nameInput = getByPlaceholderText(document.body, "Nom");
        const $elementInput = getByPlaceholderText(document.body, "Élément");
        const $weightInput = getByPlaceholderText(document.body, "Poids (kg)");
        const $submitBtn = getByRole(document.body, "button");

        await userEvent.type($nameInput, "Pikachu");
        await userEvent.type($elementInput, "electric");
        await userEvent.type($weightInput, "6");
        await userEvent.click($submitBtn);

        expect($nameInput.value).toBe("Pikachu");
        expect(api.post).toHaveBeenCalledWith("/pokemon", { nom: "Pikachu", element: "electric", image: "", poids: 6, taille: 0 });
    });
});
