import React from 'react';
import WithField from '../with-field';
import RecordPicker from '../../pickers/record-picker';

export const ForeignIdField = WithField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        
        collection,
        recordType,
        constraints,

        disabled,
    } = ps;

    var { setFieldValue } = formikForm;

    var onChange = (record) => {
        setFieldValue(dataXPath, record._id);
    }

    return (
        <RecordPicker { ...({
            ...formikField,
            onChange,
            hasError: !!formikMeta.error,

            collection,
            recordType,
            constraints,

            disabled,
            isFormik: true 
        })} />
    );
}})

