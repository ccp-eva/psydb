import React from 'react';
import classnames from 'classnames';
import { Form } from 'react-bootstrap';
import { NBSP } from '../nbsp';

export const QuickSearchWrapper = (ps) => {
    var {
        id,
        label,
        required,
        groupClassName,
        labelClassName,
        valueClassName,
        children,
    } = ps;
    
    return (
        <Form.Group className={ groupClassName }>
            <small className={ `d-block ${labelClassName}` }>
                <b>{ label }</b>
            </small>
            <div className={ valueClassName }>
                { children }
            </div>
        </Form.Group>
    );
}
