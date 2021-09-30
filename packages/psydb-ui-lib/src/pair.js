import React from 'react';

import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import PaddedText from './padded-text';

const Pair = ({ label, children, wLeft, wRight, textWrap }) => {
    wLeft = wLeft || 4;
    wRight = wRight || ( 12 - wLeft );

    var Wrap = undefined,
        style = undefined;
    if (textWrap) {
        Wrap = textWrap;
        style = {}
    }
    else {
        Wrap = 'b';
        style = { fontWeight: 600 }
    }

    return (
        <Row>
            <Col sm={ wLeft }>
                <PaddedText>{ label }</PaddedText>
            </Col>
            <Col sm={ wRight }>
                <PaddedText>
                    <Wrap style={ style }>{ children }</Wrap>
                </PaddedText>
            </Col>
        </Row>
    );
}

export default Pair;
