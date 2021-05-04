import React, { useState, useEffect } from 'react';
import jsonpointer from 'jsonpointer';

const FieldDataBodyCols = ({
    record,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,
}) => {
    return (
        displayFieldData.map(it => {
            var { key, type, displayName, props, dataPointer } = it;
            var rawValue = jsonpointer.get(record, dataPointer);

            var str = rawValue;
            if (relatedRecordLabels) {
                if (type === 'ForeignId') {
                    str = relatedRecordLabels[props.collection][rawValue]._recordLabel;
                }
                else if (type === 'ForeignIdList') {
                    str = rawValue.map(id => (
                        relatedRecordLabels[props.collection][id]._recordLabel
                    )).join();
                }
            }

            // TODO use stringifiers from common
            return (
                <td key={ key }>{ str }</td>
            );
        })

    );
}

export default FieldDataBodyCols;
