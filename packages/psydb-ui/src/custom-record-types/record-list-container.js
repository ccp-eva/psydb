import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { LinkButton } from '@mpieva/psydb-ui-lib';
import RecordList from './record-list'

const RecordListContainer = ({
    collection,
    recordType,

    enableNew,
    enableView,
    enableEdit,
}) => {
    var { path, url } = useRouteMatch();

    return (
        <>
        <LinkButton to={`${path}/new`}>
            Neuer Eintrag
        </LinkButton>
        <RecordList
            linkBaseUrl={ url }
            collection={ collection }
            recordType={ recordType }
        />
        </>
    );
}

export default RecordListContainer;
