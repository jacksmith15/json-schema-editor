import React from 'react';
import './App.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';


const KEYWORDS = {
  array: {
    minItems: {name: "Minimum Items", type: "number"},
    maxItems: {name: "Maximum Items", "type": "number"},
    uniqueItems: {name: "Unique Items", "type": "checkbox"},
  },
  boolean: {},
  integer: {
    minimum: {name: "Minimum Value", "type": "number"},
    maximum: {name: "Maximum Value", "type": "number"},
    exclusiveMaximum: {name: "Exclusive Maximum", "type": "number"},
    exclusiveMinimum: {name: "Exclusive Minimum", "type": "number"},
    multipleOf: {name: "Multiple Of", "type": "number"},
  },
  number: {
    minimum: {name: "Minimum Value", "type": "number"},
    maximum: {name: "Maximum Value", "type": "number"},
    exclusiveMaximum: {name: "Exclusive Maximum", "type": "number"},
    exclusiveMinimum: {name: "Exclusive Minimum", "type": "number"},
    multipleOf: {name: "Multiple Of", "type": "number"},
  },
  null: {},
  object: {
    additionalProperties: {name: "Additional Properties", "type": "checkbox"},
    minProperties: {name: "Minimum Properties", "type": "number"},
    maxProperties: {name: "Maximum Properties", "type": "number"},
  },
  string: {
    format: {name: "Format", "type": "string"},
    pattern: {name: "Pattern", "type": "string"},
    minLength: {name: "Minimum Length", "type": "string"},
    maxLength: {name: "Maximum Length", "type": "string"},
  }
}

function keywordField(keyword, name, type) {
  return (
    <div className="keyword-field" key={keyword}>
      {name}
      <Field
        type={type}
        name={keyword}
      />
    </div>
  )
}


function keywordGroup(typeName) {
  return (
    <React.Fragment key={typeName}>
      {Object.entries(KEYWORDS[typeName]).map((keywordItem) => keywordField(keywordItem[0], keywordItem[1].name, keywordItem[1].type))}
    </React.Fragment>
  )
}

function keywordGroups(typeValue) {
  let typeSet = new Set(typeValue);
  if (typeSet.has("integer") && typeSet.has("number")) {
    typeSet.delete("number");
  }
  return typeValue.map(keywordGroup)
}

function ReactForm(props) {
  return (
    <React.Fragment>
    {(props && props.name) || ""}
    <Formik
      initialValues={{ type: [] }}
      valdate={values => {}}
      onSubmit={
        (values, formik) => {
          let allValues = Object.assign({}, values);
          console.log(formik);
          alert(JSON.stringify(allValues, null, 2));
          formik.setSubmitting(false);
        }
      }
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          Type
          <Field
            as="select"
            name="type"
            multiple={true}
            onChange={event =>
              setFieldValue(
                "type",
                [].slice
                  .call(event.target.selectedOptions)
                  .map(option => option.value)
              )
            }
          >
            <option value="array">Array</option>
            <option value="boolean">Boolean</option>
            <option value="integer">Integer</option>
            <option value="null">Null</option>
            <option value="number">Number</option>
            <option value="object">Object</option>
            <option value="string">String</option>
          </Field>
          {keywordGroups(values.type)}
          {values.type.includes("array") && ReactForm({name: "Items"})}
          {(props && props.name && true) || (
            <React.Fragment>
              <ErrorMessage name="type" component="div" />
              <button type="submit" disabled={isSubmitting}>
                Submit
             </button>
            </React.Fragment>
          )}
        </Form>
      )}
    </Formik>
    </React.Fragment>
  )
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
