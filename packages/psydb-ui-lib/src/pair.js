import React from 'react';

import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import PaddedText from './padded-text';

const Pair = ({ label, children }) => {
    return (
        <Row>
            <Col sm={4}>
                <PaddedText>{ label }</PaddedText>
            </Col>
            <Col sm={8}>
                <PaddedText>
                    <b style={{ fontWeight: 600 }}>{ children }</b>
                </PaddedText>
            </Col>
        </Row>
    );
}

export default Pair;
