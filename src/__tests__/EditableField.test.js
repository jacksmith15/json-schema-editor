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

describe("EditableField", () => {
    let unmount = null;
    beforeEach(() => {
        act(() => {
            const rendered = render(<EditableField label="Test Field" />);
            unmount = rendered.unmount;
        });
    });

    afterEach(() => {
        act(() => {
            unmount();
        });
    });

    const checkInactive = (value) => {
        expect(screen.getByRole("field-label")).toHaveTextContent("Test Field");
        expect(screen.getByRole("field-input")).toHaveValue(value);
        expect(screen.getByRole("field-input")).toHaveAttribute("readonly");
        expect(screen.queryAllByRole("edit-button").length).toEqual(1);
        expect(screen.getByRole("edit-button")).toHaveTextContent("✎");
    };

    const checkActive = (value) => {
        expect(screen.getByRole("field-label")).toHaveTextContent("Test Field");
        expect(screen.getByRole("field-input")).toHaveValue(value);
        expect(screen.getByRole("field-input")).not.toHaveAttribute("readonly");
        expect(screen.queryAllByRole("accept-button").length).toEqual(1);
        expect(screen.getByRole("accept-button")).toHaveTextContent("✓");
        expect(screen.queryAllByRole("cancel-button").length).toEqual(1);
        expect(screen.getByRole("cancel-button")).toHaveTextContent("✗");
    };

    it("should render correctly out of focus", () => {
        checkInactive("");
    });

    it("should render correctly on focus", () => {
        act(() => {
            screen.getByRole("field-input").focus();
        });
        checkActive("");
    });

    it("should focus on edit button press", () => {
        act(() => {
            screen.getByRole("edit-button").click();
        });
        checkActive("");
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
            checkInactive("");
        });

        it("should render correctly on writing in the field", () => {
            act(() => {
                let input = screen.getByRole("field-input");
                fireEvent.change(input, { target: { value: "Test value" } });
            });
            checkActive("Test value");
        });

        describe("staged changes", () => {
            beforeEach(() => {
                act(() => {
                    let input = screen.getByRole("field-input");
                    fireEvent.change(input, {
                        target: { value: "staged change" },
                    });
                });
            });

            it("should keep the changed value on blur", () => {
                act(() => {
                    screen.getByRole("field-input").blur();
                });
                checkInactive("staged change");
            });

            it("should keep the staged change on accept button press", () => {
                act(() => {
                    clickOn(screen.getByRole("accept-button"));
                });
                checkInactive("staged change");
            });

            it("should revert the staged change on cancel button press", () => {
                act(() => {
                    clickOn(screen.getByRole("cancel-button"));
                });
                checkInactive("");
            });

            it("should keep the staged change on ENTER key press", () => {
                act(() => {
                    fireEvent.keyDown(document.activeElement || document.body, {
                        key: "Enter",
                    });
                });
                checkInactive("staged change");
            });

            it("should revert the staged change on ESCAPE key press", () => {
                act(() => {
                    fireEvent.keyDown(document.activeElement || document.body, {
                        key: "Escape",
                    });
                });
                checkInactive("");
            });

        });
    });
});
