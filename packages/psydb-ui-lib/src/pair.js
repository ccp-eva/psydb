import React from 'react';

import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import PaddedText from './padded-text';

const Pair = ({ label, children, wLeft, wRight }) => {
    wLeft = wLeft || 4;
    wRight = wRight || ( 12 - wLeft );

    return (
        <Row>
            <Col sm={ wLeft }>
                <PaddedText>{ label }</PaddedText>
            </Col>
            <Col sm={ wRight }>
                <PaddedText>
                    <b style={{ fontWeight: 600 }}>{ children }</b>
                </PaddedText>
            </Col>
        </Row>
    );
}

export default Pair;
