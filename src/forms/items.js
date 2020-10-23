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


function ItemsEditor(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const tupleItems = Array.isArray(subSchema.items);
    const [selectedItem, setSelectedItem] = React.useState(null);

    const switchTuple = () => {
        let newItems = null;
        if (tupleItems) {
            if (subSchema.items && subSchema.items.length) {
                newItems = subSchema.items[0];
            } else {
                newItems = {};
            }
        } else {
            newItems = [subSchema.items];
        }
        props.setSchemaValue(Path.join(props.path, "items"), newItems);
    }

    if (tupleItems) {
        return <div>Not implemented</div>;
    }

    return (
    );
}


function ItemField(props) {

    return (
        <Card>
            <Accordion.Toggle
                as={Card.Header}
                varient="link"
                eventKey="all-items"
                onClick={() => {selectedItem !== "all-items" ? setSelectedItem("all-items") : setSelectedItem(null)}}
            >
                <Container><Row><Col><h5><i>All items</i></h5></Col></Row></Container>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="all-items">
                <Card.Body>
                    <SchemaForm
                        setSchemaValue={props.setSchemaValue}
                        delSchemaValue=
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
}