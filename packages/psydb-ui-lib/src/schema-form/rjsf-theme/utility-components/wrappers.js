import React from 'react';
import { Form } from 'react-bootstrap';
import { arrify } from '@mpieva/psydb-ui-utils';
import { FormHelpers } from '@mpieva/psydb-ui-layout';

const checkReallyRequired = ({ schema, required }) => {

    var { type, minLength } = schema;
    type = arrify(type);

    var isReallyRequired = (
        required
        && !type.includes('null')
        && (
            type.includes('string') && !!minLength
        )
    );

    return isReallyRequired;
}

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
    schema,
    required,
    valueClassName,

    rawErrors = [], 
    children,
}) => {
    var { systemProps = {} } = schema;
    var {
        uiSplit = [3,9],
        uiHrTop = false,
    } = systemProps;

    var isReallyRequired = checkReallyRequired({ schema, required });
    var hasErrors = rawErrors.length > 0;
    return (
        <>
            { uiHrTop && (
                <hr />
            )}
            <FormHelpers.InlineWrapper { ...({
                id,
                label,
                required: isReallyRequired,
                labelClassName: hasErrors ? 'text-danger': '',
                valueClassName,
                uiSplit,
                children
            })} />
        </>
    );
}

export const InlineArrayWrapper = ({
    label,

    rawErrors = [], 
    children,
}) => {
    var hasErrors = rawErrors.length > 0;
    return (
        <FormHelpers.InlineArrayWrapper { ...({
            label,
            labelClassName: hasErrors ? 'text-danger': '',
            children
        })} />
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
    var isReallyRequired = checkReallyRequired({ schema, required });
    var hasErrors = rawErrors.length > 0;
    return (
        <FormHelpers.InlineWrapper { ...({
            id,
            label: label || schema.title,
            required: isReallyRequired,
            labelClassName: hasErrors ? 'text-danger': '',
            children
        })} />
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
