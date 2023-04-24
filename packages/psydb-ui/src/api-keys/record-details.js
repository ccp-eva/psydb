import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { DetailsBox, LinkButton } from '@mpieva/psydb-ui-layout';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import { ApiKey } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, related } = fetched;
    var { url } = useRouteMatch();
    
    var canEdit = permissions.hasCollectionFlag('apiKey', 'write');

    var apiKeyBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        related
    }

    var title = 'Api-Key-Details';
    return (
        <>
            <DetailsBox
                title={ title }
                editUrl={ `${up(url, 1)}/edit` }
                canEdit= { canEdit }
            >
                <ApiKey { ...apiKeyBag }>
                    <ApiKey.Label />
                    <ApiKey.PersonnelId />
                    <ApiKey.ApiKey />
                </ApiKey>
            </DetailsBox>
        </>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody: DetailsBody,
    shouldFetchCRTSettings: false,
    shouldFetchSchema: false,
});
