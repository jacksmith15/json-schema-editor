import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { isEqual } from "lodash";
import {stringify} from "jest-matcher-utils";

import { EditableField } from "EditableField";

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

expect.extend({
    toLodashEqual(left, right) {
        return {
            pass: isEqual(left, right),
            message: () => `${left} does not equal ${right}`,
        }
    }
});

const expectStringifyEqual = (left, right) => {
    expect(stringify(left)).toEqual(stringify(right));
}

describe("EditableField", () => {
    describe("with no props", () => {

        beforeEach(() => {
            act(() => {
                render(<EditableField />, container);
            });
        });

        it("should render correctly out of focus", () => {
            expectStringifyEqual(
                container,
                <div>
                    <div class="form-group">
                        <div class="input-group">
                            <input
                                class="form-control"
                                readonly=""
                                type="text"
                                value=""
                            />
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="button">
                                    ✎
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        it("should render correctly in focus", () => {
            act(() => {
                container.querySelector("input").focus();
            });
            expectStringifyEqual(
                container,
                <div>
                    <div class="form-group">
                        <div class="input-group">
                            <input
                                class="form-control"
                                type="text"
                                value=""
                            />
                            <div class="input-group-append">
                                <button class="btn btn-success" type="button">
                                    ✓
                                </button>
                                <button class="btn btn-danger" type="button">
                                    ✗
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        it("should render correctly on edit button press", () => {
            act(() => {
                container.querySelector("button, .btn-primary").click();
            });
            expectStringifyEqual(
                container,
                <div>
                    <div class="form-group">
                        <div class="input-group">
                            <input
                                class="form-control"
                                type="text"
                                value=""
                            />
                            <div class="input-group-append">
                                <button class="btn btn-success" type="button">
                                    ✓
                                </button>
                                <button class="btn btn-danger" type="button">
                                    ✗
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    });
});
