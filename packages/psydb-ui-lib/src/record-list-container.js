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
            <RecordList
                linkBaseUrl={ url }
                collection={ collection }
                recordType={ recordType }

                enableView={ enableView }
                enableEdit={ enableEdit }

                onSelectRecord={ onSelectRecord }
            />
        </div>
    );
}

export default RecordListContainer;
