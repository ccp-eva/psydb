import React from 'react';
import WithField from '../../with-field';
import RecordPicker from '../../../pickers/record-picker';

export const HelperSetItemId = WithField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        setId,

        disabled,
        related,
    } = ps;

    var collection = 'helperSetItem';
    var constraints = { '/setId': setId };

    var { value: recordId } = formikField;
    var { setFieldValue } = formikForm;

    var onChange = (record) => {
        setFieldValue(dataXPath, record ? record._id : '');
    }

    var { relatedRecords } = related || {};
    var record;
    if (relatedRecords && relatedRecords[collection]) {
        record = relatedRecords[collection][recordId]
    }

    if (recordId && !record) {
        // create erroneous record
        record = { _id: recordId };
    }

    return (
        <RecordPicker { ...({
            ...formikField,
            value: record,
            onChange,
            hasError: !!formikMeta.error,

            collection,
            constraints,

            disabled,
            isFormik: true,

            ...related,
        })} />
    );
}})

