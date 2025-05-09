import React from 'react';
import { FallbackTheme } from '@cdxoo/formik-utils';
import { FormHelpers } from '@mpieva/psydb-ui-layout';

export const FieldWrapper = (ps) => {
    var { formikMeta } = ps;
    return (
        <FormHelpers.InlineWrapper { ...ps } />
    );
    /*return (
        <div style={{ border: '1px solid purple', padding: '5px' }}>
            <FallbackTheme.FieldWrapper { ...ps } />
            <ErrorIndicator { ...ps } />
        </div>
    )*/
};

export const FieldWrapperMultiline = (ps) => {
    var { formikMeta } = ps;
    return (
        <FormHelpers.MultiLineWrapper { ...ps } />
    );
}

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
        <FormHelpers.ScalarArrayContentWrapper { ...ps } />
    )
};

export const ArrayItemWrapper = (ps) => {
    var { index, hasError, formikMeta } = ps;
    var { error } = formikMeta;
    return (
        <>
            <FormHelpers.ScalarArrayItemWrapper { ...ps } />
        </>
    )
};

export const ScalarArrayItemWrapper = (ps) => {
    var { index, hasError, formikMeta } = ps;
    var { error } = formikMeta;
    return (
        <>
            <FormHelpers.ScalarArrayItemWrapper { ...ps } />
        </>
    )
};
export const ArrayItemFieldWrapper = (ps) => {
    var { index, hasError, formikMeta } = ps;
    var { error } = formikMeta;
    return (
        <FallbackTheme.ArrayItemFieldWrapper { ...ps } />
    );
    // FIXME: error should be set in here not in scalar array item wrapper
    return (
        <>
            <div style={{ border: '1px solid blue', padding: '5px' }}>
                <FallbackTheme.ArrayItemFieldWrapper { ...ps } />
            </div>
        </>
    )
}

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
    <FallbackTheme.NoneWrapper { ...ps } />
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
