import React from 'react';

import {
    Row,
    Col
} from 'react-bootstrap';

const Split = ({ num, children }) => {
    if (!Array.isArray(children)) {
        children = [ children ];
    }
    var sm = 12 / (num || children.length);
    return (
        <Row>
            { children.map((it, index) => (
                <Col key={ index } sm={sm}>
                    { it }
                </Col>
            ))}
        </Row>
    );
}

export default Split;
