import React, { useState, useEffect } from 'react';

import {
    Form
} from 'react-bootstrap';

const withFormDecorations = (Component) => (ps) => {
    const {
        id,
        placeholder,
        required,
        readonly,
        disabled,
        type,
        label,
        value,
        onChange,
        onBlur,
        autofocus,
        options,
        schema,
        rawErrors = []
    } = ps;

    const wrappedOnChange = createWrappedOnChange(ps);
    const wrappedOnBlur = createWrappedOnBlur(ps);
    const wrappedOnFocus = createWrappedOnFocus(ps);

    return (
        <Form.Group className="mb-0">
            <Form.Label
                className={ rawErrors.length > 0 ? "text-danger" : "" }
            >
                { label || schema.title }
                { (label || schema.title) && required ? "*" : null }
            </Form.Label>
            <Component
                { ...ps }
                onChange={ wrappedOnChange }
                onBlur={ wrappedOnBlur }
                onFocus={ wrappedOnFocus }
            />
            { schema.examples && (
                <datalist id={ `examples_${id} `}>
                    {
                        [
                            ...schema.examples,
                            ...(schema.default ? [ schema.default ] : [])
                        ].map(example => {
                            example = String(example);
                            return (
                                <option key={example} value={example} />
                            )
                        })
                    }
                </datalist>
            )}
        </Form.Group>
    );
}
  
const createWrappedOnChange = ({
    onChange,
    options,
    ...unused
}) => ( 
    (event) => {
        const { target: { value }} = event;
        const { emptyValue } = options;
        return (
            onChange(
                value === ""
                ? emptyValue
                : value
            )
        )
    }
);

const createWrappedOnBlur = ({
    onBlur,
    id,
    ...unused
}) => (
    (event) => {
        const { target: { value }} = event;
        return onBlur(id, value);
    }
);

const createWrappedOnFocus = ({
    onFocus,
    id,
    ...unused
}) => (
    (event) => {
        const { target: { value }} = event;
        onFocus(id, value)
    }
);

export default withFormDecorations; 
