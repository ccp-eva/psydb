import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { classnames } from '@mpieva/psydb-ui-utils';
import { TableBodyCustomCols } from '@mpieva/psydb-custom-fields-ui';
import { LinkButton } from '@mpieva/psydb-ui-layout';

import CheckColumn from '../check-column';

const TableRow = (ps) => {
    var {
        record,
        definitions,
        related,
        
        enableView,
        enableEdit_old,
        enableRecordRowLink,

        enableSelectRecord,
        showSelectionIndicator,
        wholeRowIsClickable,
        onSelectRecord,
        selectedRecordIds,

        linkBaseUrl,
        CustomActionListComponent,
    } = ps;

    var className = classnames([
        record._isHidden && 'bg-light text-grey'
    ]);

    return (
        <tr
            className={ className }
            style={{
                ...((onSelectRecord && !showSelectionIndicator) && {
                    cursor: 'pointer'
                })
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
            <TDs { ...ps } />
        </tr>
    );
}

const TDs = (ps) => {
    var {
        record,
        definitions,
        related,
        
        enableView,
        enableEdit_old,
        enableRecordRowLink,

        enableSelectRecord,
        showSelectionIndicator,
        wholeRowIsClickable,
        onSelectRecord,
        selectedRecordIds,

        linkBaseUrl,
        CustomActionListComponent,
    } = ps;

    return (
        <>
            { (showSelectionIndicator && wholeRowIsClickable) && (
                <CheckColumn { ...({
                    record,
                    //onSelectRecord, // FIXME: what am i doing here?
                    selectedRecordIds,
                }) } />
            )}
            <TableBodyCustomCols { ...({
                record, definitions, related,
                ...(enableRecordRowLink && {
                    wrapAsLinkTo: `#${linkBaseUrl}/${record._id}`
                })
            }) } />
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
        </>
    )
}

export default TableRow;
