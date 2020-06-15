import React from "react";
import {
    Accordion,
    Badge,
    Button,
    ButtonGroup,
    Card,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Form,
    Modal,
    Navbar,
    Row,
    Tab,
    Tabs,
    ToggleButton,
} from "react-bootstrap";

import { filterProps, merge, Path } from "helpers";
import { SchemaForm } from "Builder";

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

function TypeForm(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const types = subSchema.type;
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
    const keywordConfig = merge(
        {},
        ...Object.values(
            filterProps((key) => subSchema.type.includes(key), KEYWORDS)
        )
    );
    if (Object.keys(keywordConfig).length) {
        return (
            <Form.Group>
                <h4>Validation rules</h4>
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
    return (
        <Form.Group
            name={props.keyword}
            key={props.keyword}
            onChange={(event) => {
                const value =
                    event.target.type === "checkbox"
                        ? event.target.checked
                        : event.target.value;
                props.setSchemaValue(
                    Path.join(props.path, props.keyword),
                    value
                );
            }}
        >
            <Form.Label>{keywordSpec.name}</Form.Label>
            <Form.Control
                type={keywordSpec.type}
                defaultValue={subSchema[props.keyword]}
                defaultChecked={keywordSpec.default === true}
            ></Form.Control>
            <Button
                variant="danger"
                onClick={() =>
                    props.delSchemaValue(
                        Path.join(props.path, props.keyword),
                    )
                }
            >
                Remove
            </Button>
        </Form.Group>
    );
}

function PropertyEditor(props) {
    const [propertyName, setPropertyName] = React.useState("");

    const subSchema = new Path(props.path).get(props.schema);
    const required = subSchema.required || [];
    const setRequired = (property, isRequired) => {
        let newRequired = [];
        if (isRequired) {
            newRequired = [...required, property]
        } else {
            newRequired = required.filter((item) => item !== property);
        }
        if (!newRequired.length) {
            props.delSchemaValue(Path.join(props.path, "required"));
        } else {
            props.setSchemaValue(Path.join(props.path, "required"), newRequired);
        }
    }
    const removeProperty = (property) => {
        let newSubSchema = Path.join(props.path, "properties", property).remove(subSchema);
        let newRequired = required.filter((item) => item !== property);
        if (newRequired.length) {
            newSubSchema.required = newRequired;
        } else {
            delete newSubSchema.required;
        }
        props.setSchemaValue(props.path, newSubSchema);
    }

    const propertySchemas = subSchema.properties;
    let propertyFields = [];
    for (const property in propertySchemas) {
        propertyFields.push(
            <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey={property}>
                    <Container>
                        <Row>
                            <Col><i>{property}</i></Col>
                            <Col>
                                <ButtonGroup toggle style={{float: 'right'}}>
                                    <ToggleButton
                                        type="checkbox"
                                        checked={required.includes(property)}
                                        onChange={event => setRequired(property, event.target.checked)}
                                        variant={required.includes(property) ? "primary" : "secondary"}
                                    >
                                        Required
                                    </ToggleButton>
                                    <Button
                                        variant="danger"
                                        onClick={event => removeProperty(property)}
                                    >
                                        Remove
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Container>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={property}>
                    <Card.Body>
                        <SchemaForm
                            setSchemaValue={props.setSchemaValue}
                            delSchemaValue={props.delSchemaValue}
                            schema={props.schema}
                            path={Path.join(props.path, "properties", property)}
                        />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }
    return (
        <React.Fragment>
            <h4>Properties</h4>
            <Accordion>
                {propertyFields}
            </Accordion>
            <Form.Group
                onChange={(event) => setPropertyName(event.target.value)}
                className="form-inline"
            >
                <Form.Control
                    type="text"
                    placeholder="Enter property name here..."
                    value={propertyName}
                />
                <Button
                    onClick={() => {
                        if (propertyName.length) {
                            props.setSchemaValue(
                                Path.join(
                                    props.path,
                                    "properties",
                                    propertyName
                                ),
                                {}
                            );
                        };
                        setPropertyName("");
                    }}
                >
                    Add property
                </Button>
            </Form.Group>
        </React.Fragment>
    );
}

export { TypeForm };
