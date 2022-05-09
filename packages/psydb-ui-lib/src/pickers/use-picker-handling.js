import React, { useEffect, useState } from 'react';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';

export const usePickerHandling = ({ record, onChange }) => {
    var modal = useModalReducer();
    //console.log(record);
    var cachedRecord = record;

    // FIXME: im not sure how to best reset the state in case
    // it gets out of sync i could do it manually by checking the
    // record ids and foribly update the state
    //var [ cachedRecord, setCachedRecord ] = useState(record);

    /*useEffect(() => {
        if (!record || !record._recordLabel) {
            setCachedRecord(null);
        }
    }, [ record ])*/

    var handleSelect = (record) => {
        //setCachedRecord(record);
        onChange(record);
        modal.handleHide()
    }

    var handleClear = () => {
        //setCachedRecord(null);
        onChange(null);
    }

    return {
        modal,
        cached: cachedRecord,

        onEdit: modal.handleShow,
        onSelect: handleSelect,
        onClear: handleClear,
    }
}
