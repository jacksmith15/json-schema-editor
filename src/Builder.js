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

console.log(typeof CompositionForm);

const METATYPE = {
  reference: ReferenceForm,
  type: TypeForm,
  composition: CompositionForm,
  blank: BlankForm,
};

const COMPOSITION_KEYWORDS = new xSet(["allOf", "anyOf", "oneOf", "not"]);

function getSchemaFormComponent(schema) {
  console.log(typeof schema);
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
    setSchema(clean(new Path(path).set(schema, value)));

  const delSchemaValue = (path, value) =>
    setSchema(clean(new Path(path).set(path, null)));

  return (
    <SchemaForm
      setSchemaValue={setSchemaValue}
      delSchemaValue={delSchemaValue}
      schema={schema}
      path=""
    />
  );
  // return (
  //   <Container>
  //     <Form.Group>
  //       <Form.Label>Type</Form.Label>
  //       <Form.Control
  //         onChange={(event) => setSchemaValue("type", event.target.value)}
  //         as="select"
  //       >
  //         <option value="" disabled>
  //           Select one...
  //         </option>
  //         <option value="integer">Integer</option>
  //         <option value="string">String</option>
  //       </Form.Control>
  //     </Form.Group>
  //   </Container>
  // );
}

export default Builder;
