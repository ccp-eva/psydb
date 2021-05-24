import React, { useCallback } from 'react';

import { Form, InputGroup, Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

import RecordPicker from '../../../record-picker';

const HelperSetItemId = ({
    id,
    className,
    value: helperSetItemId,
    onChange,
    hasErrors,
    schema,
    formContext,
    ...other
}) => {
    var { systemProps } = schema;
    var { setId } = systemProps;

    var { relatedHelperSetItems } = formContext;
    
    var helperSetItem;
    if (relatedHelperSetItems) {
        var relatedSet = relatedHelperSetItems[setId];
        if (relatedSet) {
            helperSetItem = relatedSet[helperSetItemId];
            if (helperSetItem) {
                // FIXME: we should probably have helper set items
                // have _recordLabel like othe records
                helperSetItem._recordLabel = helperSetItem.state.label;
            }
        }
    }

    if (helperSetItemId && !helperSetItem) {
        // create erroneous record
        helperSetItem = { _id: helperSetItemId };
    }

    var _onChange = (helperSetItem) => {
        // FIXME: meh
        onChange({ target: { value: helperSetItem._id }});
    };

    return (
        <RecordPicker { ...({
            collection: 'helperSetItem',
            constraints: {
                '/setId': setId
            },
            
            value: helperSetItem,
            onChange: _onChange,
            hasErrors,
        })} />
    )
}

export default HelperSetItemId;
