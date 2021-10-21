import React from 'react';
import classnames from 'classnames';
import { Form } from 'react-bootstrap';
import { NBSP } from '../nbsp';

export const MultiLineWrapper = (ps) => {
    var {
        id,
        label,
        required,
        labelClassName,
        valueClassName,
        children,
    } = ps;
    
    return (
        <Form.Group>
            <Form.Label
                htmlFor={ id }
                className={ `border-bottom d-block ${labelClassName}` }
            >
                <b>
                    { label }
                    <NBSP />
                    { label && required ? '*' : null }
                </b>
            </Form.Label>
            <div className={ valueClassName }>
                { children }
            </div>
        </Form.Group>
    );
}
