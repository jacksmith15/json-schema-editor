import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

/*
 * Field with accept/reject changes buttons.
 */
function EditableField(props) {
    const [stagedValue, setStagedValue] = React.useState(props.default || "");
    const [value, setValue] = React.useState(stagedValue);
    const [focused, setFocused] = React.useState(false);

    const controlRef = React.createRef();

    const applyChange = React.useCallback(() => {
        setValue(stagedValue);
        if (props.onChange instanceof Function) {
            props.onChange({ target: { value: stagedValue } });
        }
    }, [props, stagedValue, setValue]);

    const cancelChange = React.useCallback(() => {
        setStagedValue(value);
    }, [setStagedValue, value]);

    const handleKeyPress = React.useCallback(
        (event) => {
            if (!focused) {
                return;
            }
            if (event.key === "Enter") {
                controlRef.current.blur();
            }
            if (event.key === "Escape") {
                cancelChange();
                document.activeElement.blur();
            }
        },
        [cancelChange, focused, controlRef]
    );

    React.useEffect(() => {
        document.addEventListener("keydown", handleKeyPress, false);
        return () => {
            document.removeEventListener("keydown", handleKeyPress, false);
        };
    }, [handleKeyPress]);

    let InputButtons = null;
    if (focused) {
        InputButtons = (
            <InputGroup.Append role="field-buttons">
                <Button
                    key="accept"
                    role="accept-button"
                    variant="success"
                    hidden={!focused}
                    onMouseDown={applyChange}
                >
                    &#x2713;
                </Button>
                <Button
                    key="cancel"
                    role="cancel-button"
                    variant="danger"
                    hidden={!focused}
                    onMouseDown={cancelChange}
                >
                    &#x2717;
                </Button>
            </InputGroup.Append>
        );
    } else {
        InputButtons = (
            <InputGroup.Append role="field-buttons">
                <Button
                    key="edit"
                    role="edit-button"
                    hidden={focused}
                    onClick={() => {
                        controlRef.current.focus && controlRef.current.focus();
                    }}
                >
                    &#x270e;
                </Button>
            </InputGroup.Append>
        );
    }
    return (
        <Form.Group>
            {props.label && (
                <Form.Label role="field-label">{props.label}</Form.Label>
            )}
            <InputGroup>
                <Form.Control
                    type={props.type || "text"}
                    value={stagedValue}
                    role="field-input"
                    onChange={(event) => {
                        setStagedValue(event.target.value);
                    }}
                    readOnly={!focused}
                    ref={controlRef}
                    onFocus={() => {
                        setFocused(true);
                    }}
                    onBlur={() => {
                        applyChange(stagedValue);
                        setFocused(false);
                    }}
                ></Form.Control>
                {InputButtons}
            </InputGroup>
        </Form.Group>
    );
}

export { EditableField };
