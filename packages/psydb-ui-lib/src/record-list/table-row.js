import React, { useState, useEffect } from 'react';
import jsonpointer from 'jsonpointer';

import { LinkButton } from '@mpieva/psydb-ui-layout';

import * as stringifiers from '@mpieva/psydb-common-lib/src/field-stringifiers';
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
    wholeRowIsClickable,
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
                (!showSelectionIndicator || wholeRowIsClickable) && onSelectRecord
                ? 'button'
                : undefined
            )}
            onClick={ (
                (!showSelectionIndicator || wholeRowIsClickable) && onSelectRecord
                ? () => onSelectRecord(record)
                : undefined
            )}
        >
            { (showSelectionIndicator && !wholeRowIsClickable) && (
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
                <div className='d-flex justify-content-end pb-0 pt-0'>
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
