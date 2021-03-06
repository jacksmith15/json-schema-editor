import React from "react";
import {
    Badge,
    Button,
    Dropdown,
    DropdownButton,
    Form,
    InputGroup,
} from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

import { filterProps, merge, Path } from "helpers";
import { PropertyEditor } from "forms/properties";
import { EditableField } from "EditableField";

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
        minProperties: {
            name: "Minimum properties",
            type: "number",
            default: 0,
        },
        maxProperties: {
            name: "Maximum properties",
            type: "number",
            default: 10,
        },
    },
    string: {
        format: { name: "Format", type: "text", default: "" },
        pattern: { name: "Pattern", type: "text", default: "" },
        minLength: { name: "Minimum length", type: "number", default: 3 },
        maxLength: { name: "Maximum length", type: "number", default: 200 },
    },
};

/**
 * Get JSON parser for form input.
 */
function getParser(keyword) {
    const keywordConf = Object.assign({}, ...Object.values(KEYWORDS));
    const keywordType = keywordConf[keyword].type;
    function parser(value) {
        if (keywordType === "number") {
            return parseFloat(value);
        }
        return value;
    }
    return parser;
}

function TypeForm(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const types = subSchema.type;
    return (
        <React.Fragment>
            <h3>
                {props.schemaName}
                {types.map((value, index) => (
                    <React.Fragment key={index}>
                        {" "}
                        <Badge variant="secondary">{value}</Badge>{" "}
                    </React.Fragment>
                ))}
            </h3>
            <h4>Validation rules</h4>
            <ValidationSelector
                path={props.path}
                schema={props.schema}
                setSchemaValue={props.setSchemaValue}
            />
            <ValidationInputs
                setSchemaValue={props.setSchemaValue}
                delSchemaValue={props.delSchemaValue}
                schema={props.schema}
                path={props.path}
            />
            {types.includes("object") ? (
                <PropertyEditor
                    path={props.path}
                    schema={props.schema}
                    setSchemaValue={props.setSchemaValue}
                    delSchemaValue={props.delSchemaValue}
                />
            ) : (
                ""
            )}
        </React.Fragment>
    );
}

function ValidationSelector(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const keywordConfig = filterProps(
        (keyword) => !Object.keys(subSchema).includes(keyword),
        merge(
            {},
            ...Object.values(
                filterProps(
                    (typeName) => subSchema.type.includes(typeName),
                    KEYWORDS
                )
            )
        )
    );
    if (Object.keys(keywordConfig).length) {
        return (
            <Form.Group>
                <DropdownButton
                    id={props.path + ".add-validation"}
                    title="Add validation rule..."
                    drop="right"
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
    return null;
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
                delSchemaValue={props.delSchemaValue}
                keyword={keyword}
            />
        );
    }
    return <React.Fragment>{inputs}</React.Fragment>;
}

function ValidationInput(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const keywordSpec = merge({}, ...Object.values(KEYWORDS))[props.keyword];
    if (keywordSpec.type === "checkbox") {
        return (
            <Form.Group>
                <Form.Label>{keywordSpec.name}</Form.Label>
                <InputGroup>
                    <Form.Control readOnly={true} type="text" value={keywordSpec.name}/>
                    <InputGroup.Append>
                        <Button
                            variant="danger"
                            onClick={() => props.delSchemaValue(Path.join(props.path, props.keyword))}
                        >
                            <Trash/>
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
        );
    }
    return <EditableField
        label={keywordSpec.name}
        key={props.keyword}
        type={keywordSpec.type}
        default={subSchema[props.keyword]}
        onChange={(event) => {
            const value =
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value;
            props.setSchemaValue(
                Path.join(props.path, props.keyword),
                getParser(props.keyword)(value)
            );
        }}
        onRemove={() =>
            props.delSchemaValue(
                Path.join(props.path, props.keyword)
            )
        }
    />
}

export { TypeForm };
