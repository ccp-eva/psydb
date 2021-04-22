import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import LinkButton from './link-button';
import RecordList from './record-list';

const RecordListContainer = ({
    collection,
    recordType,

    enableNew,
    enableView,
    enableEdit,

    enableSelectRecords,
    showSelectionIndicator,
    selectedRecordIds,
    onSelectRecord,
}) => {
    var { path, url } = useRouteMatch();

    return (
        <div>
            { enableNew && (
                <LinkButton to={`${url}/new`}>
                    Neuer Eintrag
                </LinkButton>
            )}
            <RecordList { ...({
                linkBaseUrl: url,
                collection,
                recordType,

                enableView,
                enableEdit,

                enableSelectRecords,
                showSelectionIndicator,
                selectedRecordIds,
                onSelectRecord,
            }) } />
        </div>
    );
}

export default RecordListContainer;
