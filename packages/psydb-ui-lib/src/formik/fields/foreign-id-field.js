import React from 'react';
import WithField from '../with-field';
import RecordPicker from '../../pickers/record-picker';

export const ForeignIdField = WithField({ Control: (ps) => {
    var {
        formikField,
        formikMeta,
        
        collection,
        recordType,
        constraints,

        disabled,
    } = ps;

    return (
        <RecordPicker { ...({
            ...formikField,
            hasError: !!formikMeta.error,

            collection,
            recordType,
            constraints,

            disabled,
            isFormik: true 
        })} />
    );
}})

