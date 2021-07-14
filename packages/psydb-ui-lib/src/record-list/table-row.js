import React, { useState, useEffect } from 'react';
import jsonpointer from 'jsonpointer';

import {
    CheckSquareFill,
    Square
} from 'react-bootstrap-icons';

import * as stringifiers from '@mpieva/psydb-common-lib/src/field-stringifiers';
import LinkButton from '../link-button';
import CheckColumn from '../check-column';

import FieldDataBodyCols from './field-data-body-cols';

const TableRow = ({
    displayFieldData,
    record,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    
    enableView,
    enableEdit_old,

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
            role={(
                !showSelectionIndicator && onSelectRecord
                ? 'button'
                : undefined
            )}
            onClick={ (
                !showSelectionIndicator && onSelectRecord
                ? () => onSelectRecord(record)
                : undefined
            )}
        >
            { showSelectionIndicator && (
                <CheckColumn { ...({
                    record,
                    onSelectRecord,
                    selectedRecordIds,
                }) } />
            )}
            <FieldDataBodyCols { ...({
                record,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            })} />
            <td>
                <div className='d-flex justify-content-end pb-0 pt-2'>
                {
                    CustomActionListComponent
                    ? (
                        <CustomActionListComponent { ...({
                            linkBaseUrl,
                            record,
                        }) } />
                    )
                    : (
                        <>
                            { enableView && (
                                <LinkButton
                                    size='sm'
                                    to={`${linkBaseUrl}/${record._id}`}>
                                    Details
                                </LinkButton>
                            )}
                            { enableEdit_old && (
                                <LinkButton
                                    size='sm'
                                    to={`${linkBaseUrl}/${record._id}/edit`}>
                                    Edit
                                </LinkButton>
                            )}
                        </>
                    )
                }
                </div>
            </td>
        </tr>
    );
}

export default TableRow;
