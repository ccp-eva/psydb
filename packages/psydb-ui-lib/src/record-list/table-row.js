import React, { useState, useEffect } from 'react';
import jsonpointer from 'jsonpointer';

import {
    CheckSquareFill,
    Square
} from 'react-bootstrap-icons';

import LinkButton from '../link-button';

const TableRow = ({
    displayFieldData,
    record,
    
    enableView,
    enableEdit,

    enableSelectRecord,
    showSelectionIndicator,
    onSelectRecord,
    selectedRecordIds,

    linkBaseUrl,
}) => {
    return (
        <tr onClick={ onSelectRecord && (() => onSelectRecord(record)) }>
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
                var rawValue = jsonpointer.get(record, it.dataPointer);
                // TODO use stringifiers from common
                return (
                    <td key={ it.key }>{ String(rawValue) }</td>
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
