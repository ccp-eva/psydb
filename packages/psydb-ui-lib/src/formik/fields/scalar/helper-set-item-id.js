import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import RecordPicker from '../../../pickers/record-picker';

export const HelperSetItemId = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        setId,
        constraints,
        isNullable,

        disabled,
        related,
    } = ps;

    var collection = 'helperSetItem';
    var constraints = { '/setId': setId };

    var { value: recordId } = formikField;
    var { setFieldValue } = formikForm;

    var onChange = (record) => {
        var fallback = isNullable ? null : undefined;
        setFieldValue(dataXPath, record ? record._id : fallback);
    }

    var { relatedHelperSetItems } = related || {};
    var record;
    if (relatedHelperSetItems && relatedHelperSetItems[setId]) {
        record = relatedHelperSetItems[setId][recordId];
        record._recordLabel = record.state.label;
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

