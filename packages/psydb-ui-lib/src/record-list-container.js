import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { LinkButton } from '@mpieva/psydb-ui-layout';
import RecordList from './record-list';

const RecordListContainer = ({
    target,
    collection,
    recordType,
    constraints,
    searchOptions,
    defaultSort,

    enableNew,
    enableView,
    enableEdit_old,
    enableRecordRowLink,

    enableSelectRecords,
    showSelectionIndicator,
    selectedRecordIds,
    onSelectRecord,

    className,
    tableClassName,
    bsTableProps,
    CustomActionListComponent,
}) => {
    var { path, url } = useRouteMatch();
    var permissions = usePermissions();

    var canCreate = permissions.hasCollectionFlag(collection, 'write');

    return (
        <div className={ className }>
            <div className='media-print-hidden'>
                { enableNew && canCreate && (
                    <LinkButton to={`${url}/new`}>
                        Neuer Eintrag
                    </LinkButton>
                )}
            </div>
            <RecordList { ...({
                linkBaseUrl: url,
                target,
                collection,
                recordType,
                constraints,
                searchOptions,
                defaultSort,

                enableView,
                enableEdit_old,
                enableRecordRowLink,

                enableSelectRecords,
                showSelectionIndicator,
                selectedRecordIds,
                onSelectRecord,

                tableClassName,
                bsTableProps,
                CustomActionListComponent,
            }) } />
        </div>
    );
}

export default RecordListContainer;
