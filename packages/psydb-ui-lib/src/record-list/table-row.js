import React, { useState, useEffect } from 'react';
import jsonpointer from 'jsonpointer';

import {
    CheckSquareFill,
    Square
} from 'react-bootstrap-icons';

import * as stringifiers from '../field-stringifiers';
import LinkButton from '../link-button';

import FieldDataBodyCols from './field-data-body-cols';

const TableRow = ({
    displayFieldData,
    record,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    
    enableView,
    enableEdit,

    enableSelectRecord,
    showSelectionIndicator,
    onSelectRecord,
    selectedRecordIds,

    linkBaseUrl,
    CustomActionListComponent,
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
            <FieldDataBodyCols { ...({
                record,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            })} />
            <td>
                {
                    CustomActionListComponent
                    ? (
                        <CustomActionListComponent { ...({
                            record,
                        }) } />
                    )
                    : (
                        <>
                            { enableView && (
                                <LinkButton to={`${linkBaseUrl}/${record._id}`}>
                                    Details
                                </LinkButton>
                            )}
                            { enableEdit && (
                                <LinkButton to={`${linkBaseUrl}/${record._id}/edit`}>
                                    Edit
                                </LinkButton>
                            )}
                        </>
                    )
                }

            </td>
        </tr>
    );
}

export default TableRow;
