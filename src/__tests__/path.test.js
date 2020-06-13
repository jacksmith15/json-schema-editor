import { Path } from "helpers";

describe("Path", () => {
    describe(".join", () => {
        it("accepts empty string", () => {
            expect(Path.join("")).toEqual("");
        });
        it("accepts single key", () => {
            expect(Path.join("foo")).toEqual("foo");
        });
        it("accepts two keys", () => {
            expect(Path.join("foo", "bar")).toEqual("foo.bar");
        });
        it("accepts three keys", () => {
            expect(Path.join("foo", "bar", "baz")).toEqual("foo.bar.baz");
        });
        it("accepts pre-joined paths", () => {
            expect(Path.join("foo.bar", "baz")).toEqual("foo.bar.baz");
        });
        it("accepts Path objects", () => {
            expect(Path.join(new Path("foo"), new Path("bar"))).toEqual(
                "foo.bar"
            );
        });
        it("accepts mixed objects", () => {
            expect(Path.join(new Path("foo"), "bar")).toEqual("foo.bar");
        });
        it("returns Path object", () => {
            expect(Path.join("foo", "bar")).toEqual(expect.any(Path));
        });
        it("ignores empty strings", () => {
            expect(Path.join("", "foo")).toEqual("foo");
        });
    });

    describe(".segments", () => {
        it("splits no key path", () => {
            expect(new Path("").segments).toEqual([]);
        });
        it("splits single key path", () => {
            expect(new Path("foo").segments).toEqual(["foo"]);
        });
        it("splits two-part paths", () => {
            expect(new Path("foo.bar").segments).toEqual(["foo", "bar"]);
        });
        it("splits three-path paths", () => {
            expect(new Path("foo.bar.baz").segments).toEqual([
                "foo",
                "bar",
                "baz",
            ]);
        });
        it("splits joined path", () => {
            expect(Path.join("foo.bar", "baz").segments).toEqual([
                "foo",
                "bar",
                "baz",
            ]);
        });
        it("ignores spaces", () => {
            expect(new Path("foo bar.baz").segments).toEqual([
                "foo bar",
                "baz",
            ]);
        });
    });

    describe(".depth", () => {
        it("is zero for empty string", () => {
            expect(new Path("").depth).toEqual(0);
        });
        it("is one for single segment", () => {
            expect(new Path("foo").depth).toEqual(1);
        });
        it("is two for two segments", () => {
            expect(new Path("foo.bar").depth).toEqual(2);
        });
    });

    describe(".get", () => {
        const object = { foo: { bar: "baz" }, qux: ["mux", "tux"] };
        it("returns whole object for no segments", () => {
            expect(Path.join("").get(object)).toEqual(object);
        });
        it("traverses single segments", () => {
            expect(Path.join("foo").get(object)).toEqual(object["foo"]);
        });
        it("traverses multiple segments", () => {
            expect(Path.join("foo", "bar").get(object)).toEqual(
                object["foo"]["bar"]
            );
        });
        it("traverses array indices", () => {
            expect(Path.join("qux", "1").get(object)).toEqual(object["qux"][1]);
        });
        it("returns null for missing single segment", () => {
            expect(Path.join("baz").get(object)).toEqual(null);
        });
        it("returns null for missing nested segment", () => {
            expect(Path.join("foo", "baz").get(object)).toEqual(null);
        });
        it("returns null for missing array index", () => {
            expect(Path.join("qux", "10").get(object)).toEqual(null);
        });
        it("returns null when path travels through primitive", () => {
            expect(Path.join("foo", "bar", "baz", "qux").get(object)).toEqual(
                null
            );
        });

        describe("with a default", () => {
            const defaultValue = "I'm a default";
            it("returns defaultValue for missing single segment", () => {
                expect(Path.join("baz").get(object, defaultValue)).toEqual(
                    defaultValue
                );
            });
            it("returns defaultValue for missing nested segment", () => {
                expect(
                    Path.join("foo", "baz").get(object, defaultValue)
                ).toEqual(defaultValue);
            });
            it("returns defaultValue for missing array index", () => {
                expect(
                    Path.join("qux", "10").get(object, defaultValue)
                ).toEqual(defaultValue);
            });
            it("returns defaultValue when path travels through primitive", () => {
                expect(
                    Path.join("foo", "bar", "baz", "qux").get(
                        object,
                        defaultValue
                    )
                ).toEqual(defaultValue);
            });
        });
    });

    describe(".set", () => {
        const object = { foo: "bar", baz: ["a", "b"] };
        it.each([
            ["", "notanobject", "notanobject"],
            ["foo", "newfoo", { foo: "newfoo", baz: ["a", "b"] }],
            ["baz", "newbaz", { foo: "bar", baz: "newbaz" }],
            ["qux", "newqux", { foo: "bar", baz: ["a", "b"], qux: "newqux" }],
            [
                "qux.mux",
                "newquxmux",
                { foo: "bar", baz: ["a", "b"], qux: { mux: "newquxmux" } },
            ],
            ["baz.0", "c", { foo: "bar", baz: ["c", "b"] }],
        ])("sets path %s to %s", (path, value, expected) => {
            const newObject = new Path(path).set(object, value);
            expect(newObject).toEqual(expected);
        });

        it.each([["foo.bar"], ["baz.0.foo"]])("throws on bad set", (path) => {
            expect(() => new Path(path).set(object, "value")).toThrow();
        });
    });

    describe(".remove", () => {
        const object = { foo: { bar: "a" }, baz: ["b", "c"] };

        it("removes the entire object", () => {
            expect(new Path("").remove(object)).toBe(undefined);
        });

        it("removes top level object properties", () => {
            expect(new Path("foo").remove(object)).toEqual({ baz: ["b", "c"] });
        });

        it("removes top level array properties", () => {
            expect(new Path("baz").remove(object)).toEqual({
                foo: { bar: "a" },
            });
        });

        it("removes nested object properties", () => {
            expect(new Path("foo.bar").remove(object)).toEqual({
                foo: {},
                baz: ["b", "c"],
            });
        });

        it("removes nested array items", () => {
            expect(new Path("baz.1").remove(object)).toEqual({
                foo: { bar: "a" },
                baz: ["b", undefined],
            });
        });
    });
});
