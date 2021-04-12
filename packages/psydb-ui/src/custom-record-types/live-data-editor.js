import React, { useState, useEffect } from 'react';
import gatherDisplayFieldData from '@mpieva/psydb-common-lib/src/gather-display-field-data';

const LiveDataEditor = ({ record, onEdited }) => {
    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: record,
    });

    console.log(availableDisplayFieldData);

    return (
        <div>
            Anzeigename: { record.state.label } 
        </div>
    );
}

export default LiveDataEditor;
