import React from "react";
import {
    Container,
    Form,
    Button,
    Modal,
    Navbar,
    Tabs,
    Tab,
} from "react-bootstrap";

import { merge, Path } from "helpers";

function BlankForm(props) {
    const [show, setShow] = React.useState(false);
    const [tab, setTab] = React.useState("reference");
    const [choices, setChoices] = React.useState({
        reference: null,
        type: [],
        composition: null,
    });
    const handleClose = () => {
        if (tab === "composition" && choices.composition !== null) {
            props.setSchemaValue(
                Path.join(props.path, choices[tab]),
                choices[tab] === "not" ? {} : []
            );
        } else if (tab === "reference" && choices.reference !== null) {
            props.setSchemaValue(
                Path.join(props.path, "$ref"),
                `#/definitions/${choices[tab]}`
            );
        } else if (tab === "type") {
            props.setSchemaValue(Path.join(props.path, "type"), choices[tab]);
        }
        setShow(false);
    };
    const handleShow = () => setShow(true);

    return (
        <Form.Group>
            <Button onClick={handleShow} block>
                Create schema
            </Button>

            <LaunchSchemaModal
                show={show}
                handleClose={handleClose}
                tab={tab}
                setTab={setTab}
                choices={choices}
                setChoices={setChoices}
            />
        </Form.Group>
    );
}

function LaunchSchemaModal(props) {
    return (
        <Modal
            show={props.show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create schema
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs
                    activeKey={props.tab}
                    onSelect={(key) => props.setTab(key)}
                >
                    {ReferenceTab({
                        choices: props.choices,
                        setChoices: props.setChoices,
                    })}
                    {TypeTab({
                        choices: props.choices,
                        setChoices: props.setChoices,
                    })}
                    {CompositionTab({
                        choices: props.choices,
                        setChoices: props.setChoices,
                    })}
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.handleClose}>Accept</Button>
            </Modal.Footer>
        </Modal>
    );
}

function ReferenceTab(props) {
    return (
        <Tab eventKey="reference" title="Choose reference">
            <div class="mt-3"/>
            <Form.Group className="my-2">
                <Form.Control
                    as="select"
                    onChange={(event) =>
                        props.setChoices(
                            merge(props.choices, {
                                reference: event.target.value,
                            })
                        )
                    }
                    defaultValue=""
                >
                    {/* These options should be pulled from a store. */}
                    <option value="" disabled>
                        Select one..
                    </option>
                    <option value="uuid">UUID</option>
                    <option value="even-number">Even Number</option>
                </Form.Control>
            </Form.Group>
        </Tab>
    );
}

function TypeTab(props) {
    return (
        <Tab eventKey="type" title="Create new">
            <div class="mt-3"/>
            <Form.Group className="my-2">
                <Form.Control
                    as="select"
                    multiple
                    onChange={(event) =>
                        props.setChoices(
                            merge(props.choices, {
                                type: [].slice
                                    .call(event.target.selectedOptions)
                                    .map((opt) => opt.value),
                            })
                        )
                    }
                    value={props.choices.type}
                >
                    <option value="array">Array</option>
                    <option value="boolean">Boolean</option>
                    <option value="integer">Integer</option>
                    <option value="null">Null</option>
                    <option value="number">Number</option>
                    <option value="object">Object</option>
                    <option value="string">String</option>
                </Form.Control>
            </Form.Group>
        </Tab>
    );
}

function CompositionTab(props) {
    return (
        <Tab eventKey="composition" title="Compose">
            <div class="mt-3"/>
            <Form.Group className="my-2">
                <Form.Control
                    as="select"
                    onChange={(event) =>
                        props.setChoices(
                            merge(props.choices, {
                                composition: event.target.value,
                            })
                        )
                    }
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select one..
                    </option>
                    <option value="anyOf">Match Any</option>
                    <option value="allOf">Match All</option>
                    <option value="oneOf">Match One</option>
                    <option value="not">Not</option>
                </Form.Control>
            </Form.Group>
        </Tab>
    );
}

export { BlankForm };
