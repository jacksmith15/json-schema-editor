import React from "react";
import { Path } from "helpers";

function TypeForm(props) {
    const subSchema = new Path(props.path).get(props.schema);
    return <div>Not implemented</div>;
    // return (
    //     <Form.Group>
    //         <Form.Label>Type</Form.Label>
    //         <Form.Control
    //             onChange={(event) =>
    //                 props.setSchemaValue(
    //                     Path.join(props.path, "type"),
    //                     event.target.value
    //                 )
    //             }
    //             as="select"
    //         >
    //             <option value="" selected={true} disabled>
    //                 Select one...
    //             </option>
    //             <option value="integer">Integer</option>
    //             <option value="string">String</option>
    //         </Form.Control>
    //     </Form.Group>
    // );
}

export { TypeForm };
