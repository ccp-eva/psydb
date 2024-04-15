import React from 'react';

import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import PaddedText from './padded-text';

const Pair = (ps) => {
    var {
        label,
        className,
        children,
        wLeft,
        wRight,
        textWrap,
        noPaddedText = false,
    } = ps;

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
        <Row className={ className }>
            <Col xs={ wLeft }>
                { noPaddedText ? (
                    label
                ) : (
                    <PaddedText>{ label }</PaddedText>
                )}
            </Col>
            <Col xs={ wRight }>
                { noPaddedText ? (
                    <Wrap style={ style }>{ children }</Wrap>
                ) : (
                    <PaddedText>
                        <Wrap style={ style }>{ children }</Wrap>
                    </PaddedText>
                )}
            </Col>
        </Row>
    );
}

export default Pair;
