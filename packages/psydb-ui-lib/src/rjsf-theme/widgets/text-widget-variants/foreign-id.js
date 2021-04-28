import React, { useCallback } from 'react';

import { Form, InputGroup, Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

import RecordPicker from '../../../record-picker';

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

    console.log(formContext);
    var { relatedRecordLabels } = formContext;
    var record;
    if (relatedRecordLabels) {
        record = relatedRecordLabels[collection][recordId]
        console.log(record);
    }

    if (recordId && !record) {
        // create erroneous record
        record = { _id: recordId };
    }

    var _onChange = (record) => {
        // FIXME: meh
        onChange({ target: { value: record._id }});
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
