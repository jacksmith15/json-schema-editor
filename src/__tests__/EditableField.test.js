import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";

import { EditableField } from "EditableField";

function clickOn(target) {
    fireEvent.mouseOver(target);
    fireEvent.mouseMove(target);
    fireEvent.mouseDown(target);
    target.focus();
    fireEvent.mouseUp(target);
    fireEvent.click(target);
}


const TEST_VALUES = {
    text: "staged value",
    number: 10,
    textarea: "multiline\nvalue"
}


describe.each(["text", "number", "textarea"])("EditableField", (type) => {
    let unmount = null;
    beforeEach(() => {
        act(() => {
            let rendered = null;
            if (type === "textarea") {
                rendered = render(<EditableField label="Test Field" as={type}/>);
            } else {
                rendered = render(<EditableField label="Test Field" type={type}/>);
            }
            unmount = rendered.unmount;
        });
    });

    afterEach(() => {
        act(() => {
            unmount();
        });
    });

    const defaultValue = {
        number: null,
        text: "",
        textarea: "",
    }

    const checkInactive = (value, remove=false) => {
        expect(screen.getByRole("field-label")).toHaveTextContent("Test Field");
        expect(screen.getByRole("field-input")).toHaveValue(value);
        expect(screen.getByRole("field-input")).toHaveAttribute("readonly");
        expect(screen.queryAllByRole("edit-button").length).toEqual(1);
        expect(screen.queryAllByRole("remove-button").length).toEqual(remove ? 1 : 0);
    };

    const checkActive = (value) => {
        expect(screen.getByRole("field-label")).toHaveTextContent("Test Field");
        expect(screen.getByRole("field-input")).toHaveValue(value);
        expect(screen.getByRole("field-input")).not.toHaveAttribute("readonly");
        expect(screen.queryAllByRole("accept-button").length).toEqual(1);
        expect(screen.queryAllByRole("cancel-button").length).toEqual(1);
    };

    it("should render correctly out of focus", () => {
        checkInactive(defaultValue[type]);
    });

    it("should render correctly on focus", () => {
        act(() => {
            screen.getByRole("field-input").focus();
        });
        checkActive(defaultValue[type]);
    });

    it("should focus on edit button press", () => {
        act(() => {
            screen.getByRole("edit-button").click();
        });
        checkActive(defaultValue[type]);
    });

    describe("focused", () => {
        beforeEach(() => {
            act(() => {
                screen.getByRole("field-input").focus();
            });
        });

        it("should render correctly on blur", () => {
            act(() => {
                screen.getByRole("field-input").blur();
            });
            checkInactive(defaultValue[type]);
        });

        it("should render correctly on writing in the field", () => {
            act(() => {
                let input = screen.getByRole("field-input");
                fireEvent.change(input, { target: { value: TEST_VALUES[type] } });
            });
            checkActive(TEST_VALUES[type]);
        });

        describe("staged changes", () => {
            beforeEach(() => {
                act(() => {
                    let input = screen.getByRole("field-input");
                    fireEvent.change(input, {
                        target: { value: TEST_VALUES[type]},
                    });
                });
            });

            it("should keep the changed value on blur", () => {
                act(() => {
                    screen.getByRole("field-input").blur();
                });
                checkInactive(TEST_VALUES[type]);
            });

            it("should keep the staged change on accept button press", () => {
                act(() => {
                    clickOn(screen.getByRole("accept-button"));
                });
                checkInactive(TEST_VALUES[type]);
            });

            it("should revert the staged change on cancel button press", () => {
                act(() => {
                    clickOn(screen.getByRole("cancel-button"));
                });
                checkInactive(defaultValue[type]);
            });

            if (type !== "textarea") {
                it("should keep the staged change on ENTER key press", () => {
                    act(() => {
                        fireEvent.keyDown(document.activeElement || document.body, {
                            key: "Enter",
                        });
                    });
                    checkInactive(TEST_VALUES[type]);
                });
            }

            it("should revert the staged change on ESCAPE key press", () => {
                act(() => {
                    fireEvent.keyDown(document.activeElement || document.body, {
                        key: "Escape",
                    });
                });
                checkInactive(defaultValue[type]);
            });

        });
    });
});
