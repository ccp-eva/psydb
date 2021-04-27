import React, { useState, useEffect } from 'react';
import jsonpointer from 'jsonpointer';

import {
    CheckSquareFill,
    Square
} from 'react-bootstrap-icons';

import * as stringifiers from '../field-stringifiers';
import LinkButton from '../link-button';

const TableRow = ({
    displayFieldData,
    record,
    relatedRecords,
    relatedHelperSetItems,
    
    enableView,
    enableEdit,

    enableSelectRecord,
    showSelectionIndicator,
    onSelectRecord,
    selectedRecordIds,

    linkBaseUrl,
}) => {
    return (
        <tr
            style={{
                ...(
                    (onSelectRecord && !showSelectionIndicator) && {
                        cursor: 'pointer'
                    }
                )
            }}
            onClick={ onSelectRecord && (() => onSelectRecord(record)) }
        >
            { showSelectionIndicator && (
                <td>
                    {
                        selectedRecordIds.includes(record._id)
                        ? <CheckSquareFill />
                        : <Square />
                    }
                </td>
            )}
            { displayFieldData.map(it => {
                var { key, type, displayName, props, dataPointer } = it;
                var rawValue = jsonpointer.get(record, dataPointer);
                
                var str = rawValue;
                if (relatedRecords) {
                    if (type === 'ForeignId') {
                        str = relatedRecords[props.collection][rawValue]._recordLabel;
                    }
                    else if (type === 'ForeignIdList') {
                        str = rawValue.map(id => (
                            relatedRecords[props.collection][id]._recordLabel
                        )).join();
                    }
                }

                // TODO use stringifiers from common
                return (
                    <td key={ key }>{ str }</td>
                );
            })}
            <td>
                { enableEdit && (
                    <LinkButton to={`${linkBaseUrl}/${record._id}/edit`}>
                        Edit
                    </LinkButton>
                )}
            </td>
        </tr>
    );
}

export default TableRow;
