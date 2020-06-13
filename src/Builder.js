import React from "react";
import styled from "styled-components";
import {
    Container,
    Form,
    Button,
    Modal,
    Navbar,
    Tabs,
    Tab,
} from "react-bootstrap";
import { Path, xSet, clean } from "helpers";
import { TypeForm } from "forms/type";
import { BlankForm } from "forms/blank";
import { ReferenceForm } from "forms/reference";
import { CompositionForm } from "forms/composition";

// TODO: Spacing
// TODO: Remove properties
// TODO: Don't close accordion on change

const METATYPE = {
    reference: ReferenceForm,
    type: TypeForm,
    composition: CompositionForm,
    blank: BlankForm,
};

const COMPOSITION_KEYWORDS = new xSet(["allOf", "anyOf", "oneOf", "not"]);

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
            />
        </Container>
    );
}

function Builder(props) {
    const [schema, setSchema] = React.useState({});

    const setSchemaValue = (path, value) =>
        setSchema(new Path(path).set(schema, value));

    const delSchemaValue = (path) =>
        setSchema(new Path(path).remove(schema));

    return (
        <SchemaForm
            setSchemaValue={setSchemaValue}
            delSchemaValue={delSchemaValue}
            schema={schema}
            path=""
        />
    );
}

export {Builder, SchemaForm};
