import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { LinkButton } from '@mpieva/psydb-ui-layout';
import RecordList from './record-list';

const RecordListContainer = ({
    target,
    collection,
    recordType,
    constraints,
    defaultSort,

    enableNew,
    enableView,
    enableEdit_old,

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

    return (
        <div className={ className }>
            { enableNew && (
                <LinkButton to={`${url}/new`}>
                    Neuer Eintrag
                </LinkButton>
            )}
            <RecordList { ...({
                linkBaseUrl: url,
                target,
                collection,
                recordType,
                constraints,
                defaultSort,

                enableView,
                enableEdit_old,

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
