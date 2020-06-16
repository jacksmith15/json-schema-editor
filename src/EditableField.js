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

    const applyChange = () => {
        setValue(stagedValue);
        if (props.onChange instanceof Function) {
            props.onChange({ target: { value: stagedValue } });
        }
    };

    const cancelChange = () => {
        controlRef.current.value = value;
        setStagedValue(value);
    }

    let InputButtons = null;
    if (focused) {
        InputButtons = (
            <InputGroup.Append>
                <Button
                    key="apply"
                    variant="success"
                    hidden={!focused}
                    onMouseDown={applyChange}
                >
                    &#x2713;
                </Button>
                <Button
                    key="undo"
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
            <InputGroup.Append>
                <Button
                    key="edit"
                    hidden={focused}
                    onClick={() => {
                        console.log(controlRef.current);
                        console.log(document.activeElement);
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
            {props.label && <Form.Label>{props.label}</Form.Label>}
            <InputGroup>
                <Form.Control
                    type={props.type || "text"}
                    defaultValue={stagedValue}
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
