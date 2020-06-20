import React from "react";
import { Check, Pencil, Trash, X } from "react-bootstrap-icons";
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
            if (event.key === "Enter" && props.as !== "textarea") {
                controlRef.current.blur();
            }
            if (event.key === "Escape") {
                cancelChange();
                document.activeElement.blur();
            }
        },
        [cancelChange, focused, controlRef, props.as]
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
                    onMouseDown={applyChange}
                >
                    <Check/>
                </Button>
                <Button
                    key="cancel"
                    role="cancel-button"
                    variant="danger"
                    onMouseDown={cancelChange}
                >
                    <X/>
                </Button>
            </InputGroup.Append>
        );
    } else {
        InputButtons = (
            <InputGroup.Append role="field-buttons">
                <Button
                    key="edit"
                    role="edit-button"
                    onClick={() => {
                        controlRef.current.focus && controlRef.current.focus();
                    }}
                >
                    <Pencil/>
                </Button>
                {props.onRemove ? (
                    <Button
                        key="remove"
                        role="remove-button"
                        variant="danger"
                        onClick={props.onRemove}
                    >
                        <Trash/>
                    </Button>
                ) : null}
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
                    as={props.as || undefined}
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
