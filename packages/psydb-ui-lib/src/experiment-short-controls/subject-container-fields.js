import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
    var translate = useUITranslation();

    if (onChangeComment) {
        var onChange = wrapOnChange(onChangeComment);
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    { translate('Comment') }
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
            <Pair
                className='mb-2'
                label={ translate('Comment') }
                textWrap='span'
            >
                <i className='text-muted'>{ comment }</i>
            </Pair>
        )
    }
}

const AutoConfirmControl = (ps) => {
    var { autoConfirm, onChangeAutoConfirm } = ps;
    var translate = useUITranslation();
    
    if (onChangeAutoConfirm) {
        var onChange = wrapOnChange(onChangeAutoConfirm);
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    { translate('Confirm') }
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
