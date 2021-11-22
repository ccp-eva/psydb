import React from 'react';
import classnames from 'classnames';
import { Form } from 'react-bootstrap';
import { NBSP } from '../nbsp';

export const InlineWrapper = (ps) => {
    var {
        id,
        label,
        required,
        labelClassName,
        valueClassName,
        uiSplit,
        uiHrTop,
        children,

        error
    } = ps;
    
    var className = classnames([
        'row ml-0 mr-0',
        error && 'has-error'
    ])

    return (
        <Form.Group className={ className }>
            <Form.Label
                htmlFor={ id }
                className={ `col-sm-${uiSplit[0]} col-form-label ${labelClassName}`}
            >
                { label }
                <NBSP />
                { label && required ? '*' : null }
            </Form.Label>
            <div className={`col-sm-${uiSplit[1]} pl-0 pr-0 ${valueClassName}`}>
                { children }
            </div>
        </Form.Group>
    );
}
