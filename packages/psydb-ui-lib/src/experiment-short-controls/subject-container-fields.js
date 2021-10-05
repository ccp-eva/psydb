import React from 'react';
import {
    Row,
    Col,
    Form,
    Pair,
} from '@mpieva/psydb-ui-layout';

import {
    wrapOnChange,
    BoolControl
} from './base-fields';

const CommentControl = (ps) => {
    var { comment, onChangeComment } = ps;
    if (onChangeComment) {
        var onChange = wrapOnChange(onChangeComment);
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    Kommentar
                </Form.Label>
                <Col sm={8}>
                    <Form.Control
                        type="text"
                        value={ comment }
                        onChange={ onChange}
                    />
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Pair className='mb-2' label="Kommentar" textWrap='span'>
                <i className='text-muted'>{ comment }</i>
            </Pair>
        )
    }
}

const AutoConfirmControl = (ps) => {
    var { autoConfirm, onChangeAutoConfirm } = ps;
    if (onChangeAutoConfirm) {
        var onChange = wrapOnChange(onChangeAutoConfirm);
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    Bestätigen
                </Form.Label>
                <Col sm={8}>
                    <BoolControl
                        value={ autoConfirm }
                        onChange={ onChange }
                    />
                </Col>
            </Row>
        )
    }
    else {
        return null
    }
}

export {
    CommentControl,
    AutoConfirmControl
}
