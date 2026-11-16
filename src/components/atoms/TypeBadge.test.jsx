/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import TypeBadge from "./TypeBadge";

describe("TypeBadge Snapshot Test Suites", () => {
    it("should match snapshot", () => {
        const { container } = render(<TypeBadge element="fire" />);

        expect(container.innerHTML).toMatchInlineSnapshot(`"<span class="inline-block rounded-full px-3 py-0.5 text-xs font-semibold capitalize text-white bg-orange-500">fire</span>"`);
    });
});
