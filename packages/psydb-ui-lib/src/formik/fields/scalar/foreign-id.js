import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import RecordPicker from '../../../pickers/record-picker';

export const ForeignId = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        
        collection,
        recordType,
        constraints,
        isNullable,

        disabled,
        related,
    } = ps;

    var { value: recordId } = formikField;
    var { setFieldValue } = formikForm;

    var onChange = (record) => {
        var fallback = isNullable ? null : undefined;
        setFieldValue(dataXPath, record ? record._id : fallback);
    }

    var { relatedRecords, relatedRecordLabels } = related || {};
    relatedRecords = relatedRecords || relatedRecordLabels;

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
            hasErrors: !!formikMeta.error,

            collection,
            recordType,
            constraints,

            disabled,
            isFormik: true,

            ...related,
        })} />
    );
}})

