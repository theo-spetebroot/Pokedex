/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { getByTestId } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

/**
 * @function Pagination
 */
describe("Pagination Integration Test Suites", () => {
    it("should disable the previous button on the first page", () => {
        const { container } = render(<Pagination page={1} nbPages={5} onPrecedent={() => {}} onSuivant={() => {}} />);

        expect(getByTestId(container, "pagination-precedent")).toBeDisabled();
        expect(getByTestId(container, "pagination-page")).toHaveTextContent("Page 1 / 5");
    });

    it("should call onSuivant when the next button is clicked", async () => {
        const onSuivant = jest.fn();
        const { container } = render(<Pagination page={2} nbPages={5} onPrecedent={() => {}} onSuivant={onSuivant} />);

        await userEvent.click(getByTestId(container, "pagination-suivant"));

        expect(onSuivant).toHaveBeenCalledTimes(1);
    });
});
