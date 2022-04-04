import React from 'react';

import {
    Row,
    Col
} from 'react-bootstrap';

const Split = ({ num, children }) => {
    if (!Array.isArray(children)) {
        children = [ children ];
    }
    var xs = 12 / (num || children.length);
    return (
        <Row>
            { children.map((it, index) => (
                <Col key={ index } xs={xs}>
                    { it }
                </Col>
            ))}
        </Row>
    );
}

export default Split;
