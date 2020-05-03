import React from "react";
import "./App.css";
import { Formik, Form, Field, ErrorMessage } from "formik";

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
    minLength: { name: "Minimum Length", type: "string" },
    maxLength: { name: "Maximum Length", type: "string" },
  },
};

function keywordField(keyword, name, type) {
  return (
    <div className="keyword-field" key={keyword}>
      {name}
      <Field type={type} name={keyword} />
    </div>
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

function getDotPath(object, path) {
  if (!path) {
    return object;
  }
  const get = (obj, key) => obj[key];
  return path.split(".").reduce(get, object);
}

class JSONSchemaFields extends React.Component {
  constructor(props) {
    super(props);
    this.withPrefix = this.withPrefix.bind(this);
  }

  withPrefix(key) {
    if (!this.props.name) {
      return key;
    }
    return this.props.name + "." + key;
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
        {(this.props && this.props.name) || ""}
        Type
        <Field
          as="select"
          name={this.withPrefix("type")}
          multiple={true}
          onChange={(event) => {
            this.props.setFieldValue(
              this.withPrefix("type"),
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
        </Field>
        {keywordGroups(this.withPrefix, this.values().type)}
        {this.values().type.includes("array") && (
          <JSONSchemaFields
            name={this.withPrefix("items")}
            setFieldValue={this.props.setFieldValue}
            values={this.props.values}
          />
        )}
      </React.Fragment>
    );
  }
}

class ReactForm extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Formik
          initialValues={{ }}
          valdate={(values) => {}}
          onSubmit={(values, formik) => {
            let allValues = Object.assign({}, values);
            alert(JSON.stringify(allValues, null, 2));
            formik.setSubmitting(false);
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              <JSONSchemaFields
                values={values}
                name=""
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
              />
              <React.Fragment>
                <ErrorMessage name="type" component="div" />
                <button type="submit" disabled={this.props.isSubmitting}>
                  Submit
                </button>
              </React.Fragment>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <header className="title">JSON Schema Editor</header>
        <ReactForm />
      </div>
    );
  }
}

export default App;
