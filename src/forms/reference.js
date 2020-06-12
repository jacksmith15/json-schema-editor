import React from "react";
import { Path } from "helpers";

function ReferenceForm(props) {
    const subSchema = new Path(props.path).get(props.schema);
    return <div>Not implemented</div>;
}

export { ReferenceForm };
