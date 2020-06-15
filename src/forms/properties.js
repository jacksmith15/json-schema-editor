import React from "react";
import {
    Accordion,
    Button,
    ButtonGroup,
    Card,
    Col,
    Container,
    Form,
    InputGroup,
    Row,
    ToggleButton,
} from "react-bootstrap";

import { Path } from "helpers";
import { SchemaForm } from "Builder";

function PropertyEditor(props) {
    const [propertyName, setPropertyName] = React.useState("");

    const subSchema = new Path(props.path).get(props.schema);

    const propertySchemas = subSchema.properties;
    let propertyFields = [];
    for (const property in propertySchemas) {
        propertyFields.push(
            <PropertyField
                key={property}
                property={property}
                setSchemaValue={props.setSchemaValue}
                delSchemaValue={props.delSchemaValue}
                schema={props.schema}
                path={props.path}
            />
        );
    }
    return (
        <React.Fragment>
            <h4>Properties</h4>
            <Accordion>{propertyFields}</Accordion>
            <div class="mt-3" />
            <Form.Group
                onChange={(event) => setPropertyName(event.target.value)}
                className="form-inline"
            >
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Enter property name here..."
                        value={propertyName}
                    />
                    <InputGroup.Append>
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
                                }
                                setPropertyName("");
                            }}
                        >
                            Add property
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
        </React.Fragment>
    );
}

function PropertyField(props) {
    const property = props.property;
    const subSchema = new Path(props.path).get(props.schema);
    const required = subSchema.required || [];

    const setRequired = (isRequired) => {
        let newRequired = [];
        if (isRequired) {
            newRequired = [...required, property];
        } else {
            newRequired = required.filter((item) => item !== property);
        }
        if (!newRequired.length) {
            props.delSchemaValue(Path.join(props.path, "required"));
        } else {
            props.setSchemaValue(
                Path.join(props.path, "required"),
                newRequired
            );
        }
    };
    const removeProperty = () => {
        let newSubSchema = Path.join(props.path, "properties", property).remove(
            subSchema
        );
        let newRequired = required.filter((item) => item !== property);
        if (newRequired.length) {
            newSubSchema.required = newRequired;
        } else {
            delete newSubSchema.required;
        }
        props.setSchemaValue(props.path, newSubSchema);
    };

    return (
        <Card>
            <Accordion.Toggle
                as={Card.Header}
                variant="link"
                eventKey={property}
            >
                <Container>
                    <Row>
                        <Col>
                            <h5>
                                <i>{property}</i>
                            </h5>
                        </Col>
                        <Col>
                            <ButtonGroup toggle style={{ float: "right" }}>
                                <ToggleButton
                                    type="checkbox"
                                    checked={required.includes(property)}
                                    onChange={(event) =>
                                        setRequired(event.target.checked)
                                    }
                                    variant={
                                        required.includes(property)
                                            ? "primary"
                                            : "secondary"
                                    }
                                >
                                    Required
                                </ToggleButton>
                                <Button
                                    variant="danger"
                                    onClick={(event) => removeProperty()}
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

export { PropertyEditor };
