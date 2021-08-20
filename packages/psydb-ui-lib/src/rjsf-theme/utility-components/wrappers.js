import React from 'react';
import { Form } from 'react-bootstrap';

// TODO: move elsewhere
const NBSP = () => ('\u00A0');

export const PlainWrapper = ({ children }) => {
    return (
        <>
            { children }
        </>
    );
}

export const InlineWrapper = ({
    id,
    label,
    required,
    schema,
    valueClassName,

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
                { label }
                <NBSP />
                {label && required ? '*' : null}
            </Form.Label>
            <div className={`col-sm-9 pl-0 pr-0 ${valueClassName}`}>
                { children }
            </div>
        </Form.Group>
    );
}

export const InlineArrayWrapper = ({
    label,

    rawErrors = [], 
    children,
}) => {
    var hasErrors = rawErrors.length > 0;
    return (
        <div className='row mr-0 ml-0'>
            <header className={ `col-sm-3 ${hasErrors ? 'text-danger' : ''}` }>
                { label }
            </header>
            <div className='col-sm-9 p-0'>
                { children }
            </div>
        </div>
    );
}

export const MultiLineWrapper = ({
    id,
    label,
    required,
    schema,

    rawErrors = [], 
    children,
}) => {
    var hasErrors = rawErrors.length > 0;
    return (
        <Form.Group>
            <Form.Label
                htmlFor={ id }
                className={ `${hasErrors ? 'text-danger' : ''} border-bottom d-block`}
            >
                <b>
                    { label || schema.title }
                    <NBSP />
                    {(label || schema.title) && required ? '*' : null}
                </b>
            </Form.Label>
            <div>
                { children }
            </div>
        </Form.Group>
    );
}

export const OneLineWrapper = (ps) => {
    var { children } = ps;
    return (
        <div className=''>
            { children }
        </div>
    );
}
