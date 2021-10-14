import React, { useCallback } from 'react';

import {
    Form,
    InputGroup,
    Button,
} from '@mpieva/psydb-ui-layout';

import { RecordPicker } from '../../../../pickers';

const ForeignId = ({
    id,
    className,
    value: recordId,
    onChange,
    hasErrors,
    schema,
    formContext,
    ...other
}) => {
    var { systemProps } = schema;
    var { collection, recordType, constraints } = systemProps;

    var { relatedRecordLabels } = formContext;
    var record;
    if (relatedRecordLabels && relatedRecordLabels[collection]) {
        record = relatedRecordLabels[collection][recordId]
    }

    if (recordId && !record) {
        // create erroneous record
        record = { _id: recordId };
    }

    var _onChange = (record) => {
        // FIXME: meh
        var value = (
            record && typeof record === 'object'
            ? record._id
            : record
        )
        onChange({ target: { value }});
    };

    return (
        <RecordPicker { ...({
            collection,
            recordType,
            constraints,
            
            value: record,
            onChange: _onChange,
            hasErrors,
        })} />
    )
}

export default ForeignId;
