import React from 'react';
import classnames from 'classnames';
import { Form } from 'react-bootstrap';
import { NBSP } from '../nbsp';

export const MultiLineWrapper = (ps) => {
    var {
        id,
        label,
        required,
        labelClassName = 'border-bottom d-block border-bottom',
        valueClassName,
        children,
    } = ps;
    
    return (
        <Form.Group>
            <Form.Label
                htmlFor={ id }
                className={ labelClassName }
            >
                { label }
                { label && required
                    ? <><NBSP/>*</>
                    : null
                }
            </Form.Label>
            <div className={ valueClassName }>
                { children }
            </div>
        </Form.Group>
    );
}
