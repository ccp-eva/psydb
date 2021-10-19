import React from 'react';
import { Form } from 'react-bootstrap';

// TODO: move elsewhere
const NBSP = () => ('\u00A0');

const InlineWrapper = (ps) => {
    var {
        id,
        label,
        required,
        labelClassName,
        valueClassName,
        children,
    } = ps;
    
    return (
        <Form.Group className='row ml-0 mr-0'>
            <Form.Label
                htmlFor={ id }
                className={ `col-sm-3 col-form-label ${labelClassName}`}
            >
                { label }
                <NBSP />
                { label && required ? '*' : null }
            </Form.Label>
            <div className={`col-sm-9 pl-0 pr-0 ${valueClassName}`}>
                { children }
            </div>
        </Form.Group>
    );
}

const MultiLineWrapper = (ps) => {
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

const InlineArrayWrapper = (ps) => {
    var {
        label,
        labelClassName,
        children,
    } = ps;

    return (
        <div className='row mr-0 ml-0'>
            <header className={ `col-sm-3 ${labelClassName}` }>
                { label }
            </header>
            <div className='col-sm-9 p-0'>
                { children }
            </div>
        </div>
    );
}


export {
    InlineWrapper,
    MultiLineWrapper,
    InlineArrayWrapper,
}
