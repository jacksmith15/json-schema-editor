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

import { filterProps, merge, Path } from "helpers";
import {SchemaForm} from "Builder";

const KEYWORDS = {
    array: {
        minItems: { name: "Minimum items", type: "number", default: 0 },
        maxItems: { name: "Maximum items", type: "number", default: 10 },
        uniqueItems: { name: "Unique items", type: "checkbox", default: true },
    },
    boolean: {},
    integer: {
        minimum: { name: "Minimum value", type: "number", default: 0 },
        maximum: { name: "Maximum value", type: "number", default: 100 },
        exclusiveMaximum: {
            name: "Exclusive maximum",
            type: "number",
            default: 100,
        },
        exclusiveMinimum: {
            name: "Exclusive minimum",
            type: "number",
            default: 0,
        },
        multipleOf: { name: "Multiple of", type: "number", default: 2 },
    },
    number: {
        minimum: { name: "Minimum value", type: "number", default: 0.0 },
        maximum: { name: "Maximum value", type: "number", default: 10.0 },
        exclusiveMaximum: {
            name: "Exclusive maximum",
            type: "number",
            default: 10.0,
        },
        exclusiveMinimum: {
            name: "Exclusive minimum",
            type: "number",
            default: 0.0,
        },
        multipleOf: { name: "Multiple of", type: "number", default: 2.0 },
    },
    null: {},
    object: {
        additionalProperties: {
            name: "Additional properties",
            type: "checkbox",
            default: false,
        },
        minProperties: { name: "Minimum properties", type: "number", default: 0 },
        maxProperties: { name: "Maximum properties", type: "number", default: 10 },
    },
    string: {
        format: { name: "Format", type: "text", default: "" },
        pattern: { name: "Pattern", type: "text", default: "" },
        minLength: { name: "Minimum length", type: "number", default: 3 },
        maxLength: { name: "Maximum length", type: "number", default: 200 },
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
            {types.includes("object") ? <PropertyEditor/> : ""}
            <ValidationSelector
                path={props.path}
                schema={props.schema}
                setSchemaValue={props.setSchemaValue}
            />
            <ValidationInputs
                setSchemaValue={props.setSchemaValue}
                schema={props.schema}
                path={props.path}
            />
        </React.Fragment>
    );
}

function ValidationSelector(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const keywordConfig = merge(
        {},
        ...Object.values(
            filterProps((key) => subSchema.type.includes(key), KEYWORDS)
        )
    );
    return (
        <Form.Group>
            <DropdownButton
                id={props.path + ".add-validation"}
                title="Add validation rule..."
            >
                {Object.entries(keywordConfig).map((entry) => (
                    <Dropdown.Item
                        as="button"
                        onClick={() => {
                            props.setSchemaValue(
                                Path.join(props.path, entry[0]),
                                subSchema[entry[0]] || entry[1].default
                            );
                        }}
                    >
                        {entry[1].name}
                    </Dropdown.Item>
                ))}
            </DropdownButton>
        </Form.Group>
    );
}

function ValidationInputs(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const keywordSpecs = merge({}, ...Object.values(KEYWORDS));
    const presentKeywords = filterProps(
        (key) => Object.keys(subSchema).includes(key),
        keywordSpecs
    );
    let inputs = [];
    for (const keyword of Object.keys(presentKeywords)) {
        inputs.push(
            <ValidationInput
                path={props.path}
                schema={props.schema}
                setSchemaValue={props.setSchemaValue}
                keyword={keyword}
            />
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
            onChange={(event) => {
                const value = (event.target.type === "checkbox" ? event.target.checked : event.target.value);
                props.setSchemaValue(
                    Path.join(props.path, props.keyword),
                    value
                )
            }
            }
        >
            <Form.Label>{keywordSpec.name}</Form.Label>
            <Form.Control
                type={keywordSpec.type}
                defaultValue={subSchema[props.keyword]}
                defaultChecked={(keywordSpec.default === true)}
            ></Form.Control>
            <Button
                variant="danger"
                onClick={() =>
                    props.setSchemaValue(
                        Path.join(props.path, props.keyword),
                        null
                    )
                }
            >
                Remove
            </Button>
        </Form.Group>
    );
}

function PropertyEditor(props) {
    return <div> Property Editor Here </div>;
}


export { TypeForm };
