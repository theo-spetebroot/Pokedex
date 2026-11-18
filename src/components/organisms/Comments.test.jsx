/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { findByTestId, getByPlaceholderText, getByRole } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Comments from "./Comments";

beforeEach(() => {
    localStorage.clear();
    render(
        <QueryClientProvider client={new QueryClient()}>
            <Comments pokemonId={25} />
        </QueryClientProvider>
    );
});

describe("Comments Functional Test Suites", () => {
    it("should display the new comment and save it in localStorage", async () => {
        await userEvent.type(getByPlaceholderText(document.body, "Votre nom"), "Sacha");
        await userEvent.type(getByPlaceholderText(document.body, "Votre commentaire"), "Mon préféré !");
        await userEvent.click(getByRole(document.body, "button", { name: "Commenter" }));

        expect(await findByTestId(document.body, "comments-list")).toHaveTextContent("Mon préféré !");
        expect(getByPlaceholderText(document.body, "Votre commentaire").value).toBe("");

        const sauvegarde = JSON.parse(localStorage.getItem("pokedex-commentaires"));
        expect(sauvegarde["25"][0]).toMatchObject({ auteur: "Sacha", texte: "Mon préféré !" });
    });
});
