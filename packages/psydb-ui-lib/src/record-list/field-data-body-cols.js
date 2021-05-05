import React, { useState, useEffect } from 'react';
import applyValueToDisplayFields from '../apply-value-to-display-fields';

const FieldDataBodyCols = ({
    record,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,
}) => {

    var withValue = applyValueToDisplayFields({
        record,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
        displayFieldData,
    });

    return (
        withValue.map(it => (
            <td key={ it.key }>{ it.value }</td>
        ))
    );
}

export default FieldDataBodyCols;
