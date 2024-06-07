import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { entries, jsonpointer } from '@mpieva/psydb-core-utils';
import { useUIConfig, useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var { dev_enableForeignIdRefLinkInForms } = useUIConfig();

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
        var processedConstraints = {};
        for (var [ key, value ] of entries(constraints)) {
            if (typeof value === 'string' && value.startsWith('$data:')) {
                processedConstraints[key] = jsonpointer.get(
                    formValues,
                    // XXX: state is omitted in custom record forms
                    // so we need to remove '/state'
                    // path token in addition to the
                    // '$data:' prefix
                    '/$' + value.replace(/(?:\$data:|state\/)/g, '')
                )
            }
            else {
                processedConstraints[key] = value;
            }
        }
        constraints = processedConstraints;
        
        hasMissingConstraintValues = (
            Object.values(constraints)
            .filter(it => (it === null || it === undefined))
            .length > 0
        );
    }


    return (
        <>
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
            { dev_enableForeignIdRefLinkInForms && (
                <RefLink
                    record={ record }
                    collection={ collection }
                    recordType={ recordType }
                />
            )}
        </>
    );
}})

// XXX
var collectionUIMapping = {
    'subject': 'subjects',
    //'researchGroup': 'research-groups',
    'location': 'locations',
    'study': 'studies',
    'personnel': 'personnel',
    'externalPerson': 'external-persons',
    'externalOrganization': 'external-organizations',
    //'systemRole': 'system-roles',
    'subjectGroup': 'subject-groups'
}

var RefLink = (ps) => {
    var { record, collection, recordType } = ps;
    var value = record?._id;

    var translate = useUITranslation();

    var collectionUI = collectionUIMapping[collection];
    var uri = undefined;
    if (collectionUI && value) {
        uri = (
            recordType
            ? `#/${collectionUI}/${recordType}/${value}`
            : `#/${collectionUI}/${value}`
        );
        
        var label = translate('Go to Record');
        return (
            <small className='d-block'>
                { uri ? (
                    <a href={ uri } target='_blank'>-> { label }</a>
                ) : (
                    <span className='text-muted'>-> { label }</span>
                )}
            </small>
        )
    }
    else {
        return null;
    }
}
