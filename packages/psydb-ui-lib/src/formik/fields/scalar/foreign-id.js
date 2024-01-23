import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { entries, jsonpointer } from '@mpieva/psydb-core-utils';
import RecordPicker from '../../../pickers/record-picker';

export const ForeignId = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        extraOnChange,
        
        collection,
        recordType,
        constraints,
        isNullable,
        readOnly,

        canClear,
        disabled,
        related,

        excludedIds
    } = ps;

    var { value: recordId } = formikField;
    var { values: formValues, setFieldValue } = formikForm;

    var onChange = (record) => {
        var fallback = isNullable ? null : undefined;
        var next = record ? record._id : fallback;
        extraOnChange && extraOnChange(next);
        setFieldValue(dataXPath, next);
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

    var hasMissingConstraintValues = false;
    if (constraints) {
        constraints = (
            entries(constraints).reduce((acc, [ key, value ]) => ({
                ...acc,
                [key]: (
                    value.startsWith('$data:')
                    ? (
                        jsonpointer.get(
                            formValues,
                            // XXX: state is omitted in custom record forms
                            // so we need to remove '/state'
                            // path token in addition to the
                            // '$data:' prefix
                            '/$' + value.replace(/(?:\$data:|state\/)/g, '')
                        )
                    )
                    : value
                )
            }), {})
        )
        
        hasMissingConstraintValues = (
            Object.values(constraints)
            .filter(it => (it === null || it === undefined))
            .length > 0
        );
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
            excludedIds,

            canClear,
            disabled: disabled || hasMissingConstraintValues,
            readOnly,
            isFormik: true,

            ...related,
        })} />
    );
}})

