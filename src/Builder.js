import React from "react";
import {
    Accordion,
    Card,
    Container,
    Row,
} from "react-bootstrap";
import { Path, xSet } from "helpers";
import { TypeForm } from "forms/type";
import { BlankForm } from "forms/blank";
import { ReferenceForm } from "forms/reference";
import { CompositionForm } from "forms/composition";
import { EditableField } from "EditableField";

// TODO: Spacing
// TODO: Save and reference schemas
// TODO: Pass minimal state
// TODO: Make boolean val keywords Add/Remove only
// TODO: Stage and commit schema changes
// TODO: Make the card headers for properties look nice

const METATYPE = {
    reference: ReferenceForm,
    type: TypeForm,
    composition: CompositionForm,
    blank: BlankForm,
};

const COMPOSITION_KEYWORDS = new xSet(["allOf", "anyOf", "oneOf", "not"]);

function Builder(props) {
    const [schema, setSchema] = React.useState({});
    const [schemaName, setSchemaName] = React.useState("");

    const setSchemaValue = (path, value) =>
        setSchema(new Path(path).set(schema, value));

    const delSchemaValue = (path) => setSchema(new Path(path).remove(schema));

    return (
        <Container>
            <Row>
                <SchemaForm
                    setSchemaValue={setSchemaValue}
                    delSchemaValue={delSchemaValue}
                    schema={schema}
                    path=""
                    setSchemaName={setSchemaName}
                    schemaName={schemaName}
                />
            </Row>
            <Row>
                <SchemaRenderer schema={schema} />
            </Row>
            <div className="mt-5" />
            <Row>
                <Container>
                    <EditableField label="Test Field" default="foo"/>
                    <EditableField label="Test Field 2" default="bar"/>
                </Container>
            </Row>
        </Container>
    );
}

function SchemaRenderer(props) {
    return (
        <Container>
            <Accordion>
                <Card>
                    <Accordion.Toggle
                        as={Card.Header}
                        variant="link"
                        eventKey="preview"
                    >
                        Preview
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="preview">
                        <pre>{JSON.stringify(props.schema, null, 2)}</pre>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </Container>
    );
}

function SchemaForm(props) {
    const schema = new Path(props.path).get(props.schema);
    const FormComponent = getSchemaFormComponent(schema);
    return (
        <Container>
            <FormComponent
                setSchemaValue={props.setSchemaValue}
                delSchemaValue={props.delSchemaValue}
                schema={props.schema}
                path={props.path}
                setSchemaName={props.setSchemaName}
                schemaName={props.schemaName}
            />
        </Container>
    );
}

function getSchemaFormComponent(schema) {
    if ("$ref" in schema) {
        return METATYPE.reference;
    } else if (new xSet(schema.keys).intersection(COMPOSITION_KEYWORDS).size) {
        return METATYPE.composition;
    } else if (Object.keys(schema).includes("type")) {
        return METATYPE.type;
    } else {
        return METATYPE.blank;
    }
}

export { Builder, SchemaForm };
