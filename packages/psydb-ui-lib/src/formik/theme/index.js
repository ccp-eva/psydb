import React from 'react';
import { FallbackTheme } from '@cdxoo/formik-utils';
import { FormHelpers } from '@mpieva/psydb-ui-layout';

export const FieldWrapper = (ps) => {
    var { formikMeta } = ps;
    return (
        <div style={{ border: '1px solid green', padding: '5px' }}>
            <FormHelpers.InlineWrapper { ...ps } />
        </div>
    );
    /*return (
        <div style={{ border: '1px solid purple', padding: '5px' }}>
            <FallbackTheme.FieldWrapper { ...ps } />
            <ErrorIndicator { ...ps } />
        </div>
    )*/
};

export const ArrayFieldWrapper = (ps) => {
    return (
        <FormHelpers.InlineArrayWrapper { ...ps }/>
    );
    /*return (
        <div style={{ border: '1px solid blue', padding: '5px' }}>
            <FallbackTheme.ArrayFieldWrapper { ...ps } />
        </div>
    )*/
};

export const ArrayContentWrapper = (ps) => {
    var { hasError, formikMeta } = ps;
    return (
        <div style={{ border: '1px solid green', padding: '5px' }}>
            <FallbackTheme.ArrayContentWrapper { ...ps } />
        </div>
    )
};

export const ArrayItemWrapper = (ps) => {
    var { index, hasError, formikMeta } = ps;
    return (
        <div style={{ border: '1px solid lime', padding: '5px' }}>
            <FallbackTheme.ArrayItemWrapper { ...ps } />
        </div>
    )
};

export const ArrayItemFieldWrapper = (ps) => (
    <div style={{ border: '1px solid cyan' }}>
        <FallbackTheme.ArrayItemFieldWrapper { ...ps } />
        <ErrorIndicator { ...ps } />
    </div>
)

export const ObjectArrayContentWrapper = (ps) => {
    return (
        <FormHelpers.ObjectArrayContentWrapper { ...ps } />
    )
}

export const ObjectArrayItemWrapper = (ps) => {
    return (
        <FormHelpers.ObjectArrayItemWrapper { ...ps } />
    )
}

export const NoneWrapper = (ps) => (
    <div style={{ border: '1px solid lightgrey', padding: '5px' }}>
        <FallbackTheme.NoneWrapper { ...ps } />
    </div>
)

const ErrorIndicator = (ps) => {
    var { formikMeta, formikForm } = ps;
    var { error } = formikMeta;

    return (
        error && error['@@ERRORS']
        ? (
            <div style={{ color: '#c00' }}>
                { error['@@ERRORS'].map((err, index) => (
                    <div key={ index }><small>
                        { err.message }
                    </small></div>
                )) }
            </div>
        )
        : null
    );
}
