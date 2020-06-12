import React from "react";
import {
    Badge,
    Container,
    Dropdown,
    DropdownButton,
    Form,
    Button,
    Modal,
    Navbar,
    Tabs,
    Tab,
} from "react-bootstrap";

import { merge, Path } from "helpers";

const KEYWORDS = {
    array: {
        minItems: { name: "Minimum Items", type: "number" },
        maxItems: { name: "Maximum Items", type: "number" },
        uniqueItems: { name: "Unique Items", type: "checkbox" },
    },
    boolean: {},
    integer: {
        minimum: { name: "Minimum Value", type: "number" },
        maximum: { name: "Maximum Value", type: "number" },
        exclusiveMaximum: { name: "Exclusive Maximum", type: "number" },
        exclusiveMinimum: { name: "Exclusive Minimum", type: "number" },
        multipleOf: { name: "Multiple Of", type: "number" },
    },
    number: {
        minimum: { name: "Minimum Value", type: "number" },
        maximum: { name: "Maximum Value", type: "number" },
        exclusiveMaximum: { name: "Exclusive Maximum", type: "number" },
        exclusiveMinimum: { name: "Exclusive Minimum", type: "number" },
        multipleOf: { name: "Multiple Of", type: "number" },
    },
    null: {},
    object: {
        additionalProperties: {
            name: "Additional Properties",
            type: "checkbox",
        },
        minProperties: { name: "Minimum Properties", type: "number" },
        maxProperties: { name: "Maximum Properties", type: "number" },
    },
    string: {
        format: { name: "Format", type: "string" },
        pattern: { name: "Pattern", type: "string" },
        minLength: { name: "Minimum Length", type: "number" },
        maxLength: { name: "Maximum Length", type: "number" },
    },
};

function TypeForm(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const types = Path.join(props.path, "type").get(subSchema);
    return (
        <React.Fragment>
            <h6>
                {types.map((value, index) => (
                    <React.Fragment key={index}>
                        {" "}
                        <Badge variant="secondary">{value}</Badge>{" "}
                    </React.Fragment>
                ))}
            </h6>
            <Form.Group>
                <DropdownButton
                    id={props.path + ".add-validation"}
                    title="Add validation rule..."
                >
                    <Dropdown.Item
                        as="button"
                        onClick={() => {
                            props.setSchemaValue(
                                Path.join(props.path, "pattern"),
                                subSchema["pattern"] || ""
                            );
                        }}
                    >
                        Regular expression
                    </Dropdown.Item>
                </DropdownButton>
            </Form.Group>
            <ValidationInputs
                setSchemaValue={props.setSchemaValue}
                schema={props.schema}
                path={props.path}
            />
        </React.Fragment>
    );
}

function ValidationInputs(props) {
    const subSchema = new Path(props.path).get(props.schema);
    let inputs = [];
    if (Object.keys(subSchema).includes("pattern")) {
        inputs.push(
            <Form.Group
                name="pattern"
                key="pattern"
                onChange={(event) =>
                    props.setSchemaValue(
                        Path.join(props.path, "pattern"),
                        event.target.value
                    )
                }
            >
                <Form.Label>Pattern</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={subSchema.pattern}
                ></Form.Control>
                <Button
                    variant="danger"
                    onClick={() =>
                        props.setSchemaValue(
                            Path.join(props.path, "pattern"),
                            null
                        )
                    }
                >
                    Remove
                </Button>
            </Form.Group>
        );
    }
    return <React.Fragment>{inputs}</React.Fragment>;
}

function ValidationInput(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const keywordSpec = merge({}, ...Object.values(KEYWORDS))[props.keyword];
    return (
        <Form.Group
            name={props.keyword}
            key={props.keyword}
            onChange={(event) =>
                props.setSchemaValue(
                    Path.join(props.path, props.keyword),
                    event.target.value
                )
            }
        >
            <Form.Label>{keywordSpec.name}</Form.Label>
            <Form.Control
                type={keywordSpec.type}
                defaultValue={subSchema[props.keyword]}
            ></Form.Control>
            <Button
                variant="danger"
                onClick={() =>
                    props.setSchemaValue(Path.join(props.path, props.keyword), null)
                }
            >
                Remove
            </Button>
        </Form.Group>
    );
}

export { TypeForm };
