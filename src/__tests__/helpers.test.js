import { isEqual } from "lodash";
import { clean, xSet } from "helpers";

describe("clean()", () => {
    it.each([
        [{}, {}],
        [{ foo: "bar" }, { foo: "bar" }],
        [{ foo: null }, {}],
        [{ foo: [] }, {}],
        [{ foo: {} }, {}],
        [{ foo: { bar: { baz: {} } } }, {}],
        [[], []],
        [[{ foo: null }], [{}]],
        ["string", "string"],
        [1, 1],
        [null, null],
    ])("cleans %j as expected", (input, expected) => {
        expect(clean(input)).toEqual(expected);
    });
});

describe("xSet", () => {
    it.each([
        [[], [1], []],
        [[1], [2], []],
        [[1], [1], [1]],
        [
            [1, 2],
            [2, 1],
            [1, 2],
        ],
        [[1, 2], [2, 3], [2]],
    ])("instersection: %s & %s", (left, right, expected) => {
        const leftSet = new xSet(left);
        const rightSet = new xSet(right);
        const expectedSet = new xSet(expected);
        expect(isEqual(leftSet.intersection(rightSet), expectedSet)).toBe(true);
    });
    it.each([
        [[], [1], [1]],
        [[1], [2], [1, 2]],
        [[1], [1], [1]],
        [
            [1, 2],
            [2, 1],
            [1, 2],
        ],
        [
            [1, 2],
            [2, 3],
            [1, 2, 3],
        ],
    ])("union: %s | %s", (left, right, expected) => {
        const leftSet = new xSet(left);
        const rightSet = new xSet(right);
        const expectedSet = new xSet(expected);
        expect(isEqual(leftSet.union(rightSet), expectedSet)).toBe(true);
    });
    it.each([
        [[], [1], []],
        [[1], [2], [1]],
        [[1], [1], []],
        [[1, 2], [2, 1], []],
        [[1, 2], [2, 3], [1]],
    ])("difference: %s - %s", (left, right, expected) => {
        const leftSet = new xSet(left);
        const rightSet = new xSet(right);
        const expectedSet = new xSet(expected);
        expect(isEqual(leftSet.difference(rightSet), expectedSet)).toBe(true);
    });

    it("empty set has length zero", () => {
        expect(new xSet([]).size).toBe(0);
    });
});
