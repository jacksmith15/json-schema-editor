import React from "react";
import {
    Button,
} from "react-bootstrap";

import { Path } from "helpers";

function ReferenceForm(props) {
    const subSchema = new Path(props.path).get(props.schema);
    const referenceName = subSchema["$ref"].split("/").slice(-1)[0];
    return <Button variant="info" disabled>{referenceName}</Button>;
}

export { ReferenceForm };
