import React from 'react';
import classnames from 'classnames';
import { Form } from 'react-bootstrap';
import { NBSP } from '../nbsp';
import { ErrorIndicator } from './error-indicator';

export const InlineWrapper = (ps) => {
    var {
        id,
        label,
        required,
        formGroupClassName,
        labelClassName,
        valueClassName,
        uiSplit = [3,9],
        uiHrTop = false,
        children,

        error,
        formikMeta = {},
    } = ps;
    
    var className = classnames([
        'row ml-0 mr-0',
        (error || formikMeta.error) && 'has-error',
        formGroupClassName
    ])

    return (
        <Form.Group className={ className }>
            { label && (
                <Form.Label
                    htmlFor={ id }
                    className={ `col-sm-${uiSplit[0]} col-form-label ${labelClassName}`}
                >
                    { label }
                    <NBSP />
                    { label && required ? '*' : null }
                </Form.Label>
            )}
            <div className={`col-sm-${uiSplit[1]} pl-0 pr-0 ${valueClassName}`}>
                { children }
                <ErrorIndicator { ...ps } />
            </div>
        </Form.Group>
    );
}

