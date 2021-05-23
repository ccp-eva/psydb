import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import LinkButton from './link-button';
import RecordList from './record-list';

const RecordListContainer = ({
    collection,
    recordType,
    constraints,

    enableNew,
    enableView,
    enableEdit_old,

    enableSelectRecords,
    showSelectionIndicator,
    selectedRecordIds,
    onSelectRecord,

    className,
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
                collection,
                recordType,
                constraints,

                enableView,
                enableEdit_old,

                enableSelectRecords,
                showSelectionIndicator,
                selectedRecordIds,
                onSelectRecord,

                bsTableProps,
                CustomActionListComponent,
            }) } />
        </div>
    );
}

export default RecordListContainer;
