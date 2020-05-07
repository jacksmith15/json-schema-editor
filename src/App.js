import React from "react";
import "./App.css";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import styled from 'styled-components';
import {Form as BootstrapForm, Button, Navbar} from "react-bootstrap";

const CONTAINER = styled.div`
  background: #F7F9FA;
  height: auto;
  width: 90%;
  margin: 5em auto;
  color: snow;
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);

  @media(min-width: 786px) {
    width: 60%;
  }

  label {
    color: #24B9B6;
    font-size: 1.2em;
    font-weight: 400;
  }

  h1 {
    color: #24B9B6;
    padding-top: .5em;
  }

  .form-group {
    margin-bottom: 1.25em;
  }
`;


const FORM = styled(Form)`
  width: 90%;
  text-align: left;
  padding-top: 2em;
  padding-bottom: 2em;
  padding-left: 2em;

  @media(min-width: 786px) {
    width: 50%;
  }
`;


function filterProps(filter, obj) {
  if (Array.isArray(obj)) {
    obj.forEach((val) => {filterProps(filter, val)});
    return
  }
  if (!typeof obj === "object") {
    return
  }
  for (const prop in obj) {
    if (!filter(prop, obj[prop])) {
      delete obj[prop];
    } else if (typeof obj[prop] === "object") {
      filterProps(obj[prop]);
    }
  }
}


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
    additionalProperties: { name: "Additional Properties", type: "checkbox" },
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


function keywordField(keyword, name, type) {
  return (
    <BootstrapForm.Group name={keyword} key={keyword}>
      <BootstrapForm.Label>{name}</BootstrapForm.Label><br />
      <Field
        type={type}
        name={keyword}
        className="form-control"
      />
    </BootstrapForm.Group>
  );
}


function keywordGroup(prefix, typeName) {
  return (
    <React.Fragment key={typeName}>
      {Object.entries(KEYWORDS[typeName]).map((keywordItem) =>
        keywordField(
          prefix(keywordItem[0]),
          keywordItem[1].name,
          keywordItem[1].type
        )
      )}
    </React.Fragment>
  );
}


function keywordGroups(prefix, typeValue) {
  let typeSet = new Set(typeValue);
  if (typeSet.has("integer") && typeSet.has("number")) {
    typeSet.delete("number");
  }
  return typeValue.map((typeName) => keywordGroup(prefix, typeName));
}


function getDotPath(object, path, defaultValue) {
  if (!path) {
    return object;
  }
  try {
    const get = (obj, key) => obj[key];
    const returnValue = path.split(".").reduce(get, object);
    if (typeof returnValue === "undefined") {
      return defaultValue;
    }
    return returnValue;
  }
  catch(err) {
    return defaultValue;
  }
}


function Properties({ form, remove, push, name }) {
  let values = getDotPath(form.values, name, []);
  const propsPath = name.replace(/_properties/g, "properties");
  console.log(form);
  const removeProp = (index, propName) => {
    remove(index);
    let propsValue = Object.assign({}, getDotPath(form.values, propsPath, {}));
    delete propsValue[propName];
    form.setFieldValue(propsPath, propsValue);
  }
  return (
    <BootstrapForm.Group name="properties">
      <BootstrapForm.Label>Properties</BootstrapForm.Label>
      {values.map((propName, index) => {
        return (
          <div key={index}>
            <JSONSchemaFields
              name={`${propsPath}.${propName}`}
              setFieldValue={form.setFieldValue}
              values={form.values}
            />
            <BootstrapForm.Group name="remove">
              <Button type="button" onClick={() => removeProp(index, propName)} variant="danger">
                Remove
              </Button>
            </BootstrapForm.Group>
          </div>
        );
      })}
      <Formik
        initialValues={{ propName: "" }}
        valdate={(values) => {}}
        onSubmit={(values, formik) => {
          push(values.propName)
        }}
      >
        {
          (subformik) => (
            <BootstrapForm className="form-inline">
              <Field
                className="form-control"
                name="propName"
                type="text"
                placeholder="Add a new property"
              />
              <Button type="button" onClick={() => subformik.submitForm()} variant="dark" className="mx-2">
              Add Property
              </Button>
            </BootstrapForm>
          )
        }
      </Formik>
    </BootstrapForm.Group>
  );
};


const HideScrollBarSelect = styled(Field)`
  overflow-y: auto;
`

class TypeSelector extends React.Component {
  render() {
    return (
      <BootstrapForm.Group name={this.props.name}>
        <BootstrapForm.Label>Type</BootstrapForm.Label><br />
        <HideScrollBarSelect
          as="select"
          className="form-control"
          name={this.props.name}
          multiple={true}
          size="7"
          onChange={(event) => {
            this.props.setFieldValue(
              this.props.name,
              [].slice
                .call(event.target.selectedOptions)
                .map((option) => option.value)
            );
          }}
        >
          <option value="array">Array</option>
          <option value="boolean">Boolean</option>
          <option value="integer">Integer</option>
          <option value="null">Null</option>
          <option value="number">Number</option>
          <option value="object">Object</option>
          <option value="string">String</option>
        </HideScrollBarSelect>
      </BootstrapForm.Group>
    )
  }
}


class JSONSchemaFields extends React.Component {
  constructor(props) {
    super(props);
    this.withPrefix = this.withPrefix.bind(this);
  }

  get depth() {
    if (!this.props.name) {
      return 0;
    }
    return this.props.name.split(".").length;
  }

  withPrefix(key) {
    if (!this.props.name) {
      return key;
    }
    return this.props.name + "." + key;
  }

  get nameDisplay() {
    if (!this.props.name) {
      return ""
    }
    return this.props.name.split(".").map((seg) => seg[0].toUpperCase() + seg.slice(1)).join(" > ");
  }

  values() {
    let value = getDotPath(this.props.values || {}, this.props.name) || {};
    if (!value.type) {
      value.type = [];
    }
    return value
  }

  render() {
    return (
      <React.Fragment>
        <BootstrapForm.Label>
          <b>{this.nameDisplay}</b>
        </BootstrapForm.Label>
        <IndentDiv depth={this.depth}>
          <TypeSelector name={this.withPrefix("type")} setFieldValue={this.props.setFieldValue} />
          {keywordGroups(this.withPrefix, this.values().type)}
          {this.values().type.includes("array") && (
            <JSONSchemaFields
              name={this.withPrefix("items")}
              setFieldValue={this.props.setFieldValue}
              values={this.props.values}
            />
          )}
          {this.values().type.includes("object") && (
            <FieldArray
              name={this.withPrefix("_properties")}
              component={Properties}
            />
          )}
        </IndentDiv>
      </React.Fragment>
    );
  }
}


const IndentDiv = styled.div.attrs(props => ({depth: props.depth || 0}))`
  padding-left: ${props => props.depth * 30}px;
`

class JSONSchemaForm extends React.Component {

  renderResults(values) {
    values = Object.assign({}, values);
    filterProps((key, val) => key !== "_properties", values);
    return JSON.stringify(values, null, 2);
  }

  render() {
    return (
      <CONTAINER className="json-schema-form">
        <Formik
          initialValues={{ }}
          valdate={(values) => {}}
          onSubmit={(values, formik) => {
            alert(this.renderResults(values));
            formik.setSubmitting(false);
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <FORM>
              <JSONSchemaFields
                values={values}
                name=""
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
              />
              <React.Fragment>
                <Button type="submit" disabled={this.props.isSubmitting} variant="dark">
                  Submit
                </Button>
              </React.Fragment>
            </FORM>
          )}
        </Formik>
      </CONTAINER>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>JSON Schema Editor</Navbar.Brand>
        </Navbar>
        <JSONSchemaForm />
      </div>
    );
  }
}

export default App;
