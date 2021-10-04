import React, { useCallback } from 'react';

import { Form, InputGroup, Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

import RecordPicker from '../../../record-picker';

const CustomRecordTypeKey = ({
    id,
    className,
    value: typeKey,
    onChange,
    hasErrors,
    schema,
    formContext,
    ...other
}) => {
    var { systemProps } = schema;
    var { collection, constraints } = systemProps;

    var { relatedCustomRecordTypeLabels } = formContext;
    var crt;
    if (relatedCustomRecordTypeLabels) {
        crt = relatedCustomRecordTypeLabels[collection][typeKey];
    }

    if (typeKey && !crt) {
        // create erroneous record
        //type = { key: typeKey };
        // FIXME: this is temporarily just so we can reuse picker
        crt = { key: typeKey };
    }

    var _onChange = (crt) => {
        // FIXME: meh
        onChange({ target: { value: crt.type }});
    };

    return (
        <RecordPicker { ...({
            collection: 'customRecordType',
            constraints: {
                '/collection': collection,
                ...constraints,
            },
            
            idLabelProp: 'type',
            value: crt,
            onChange: _onChange,
            hasErrors,
        })} />
    )
}

export default CustomRecordTypeKey;
