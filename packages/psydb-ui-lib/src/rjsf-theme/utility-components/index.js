import React from 'react';
import { Form } from 'react-bootstrap';

export const InlineWrapper = ({
    id,
    label,
    required,
    schema,

    rawErrors = [], 
    children,
}) => {
    var hasErrors = rawErrors.length > 0;
    return (
        <Form.Group className='row ml-0 mr-0'>
            <Form.Label
                htmlFor={ id }
                className={ `${hasErrors ? 'text-danger' : ''} col-sm-3 col-form-label`}
            >
                { label || schema.title }
                {' '}
                {(label || schema.title) && required ? '*' : null}
            </Form.Label>
            <div className='col-sm-9 pl-0 pr-0'>
                { children }
            </div>
        </Form.Group>
    );
}
