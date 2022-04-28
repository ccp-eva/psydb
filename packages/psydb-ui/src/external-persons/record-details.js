import React from 'react';

import { useRouteMatch  } from 'react-router-dom';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { DetailsBox } from '@mpieva/psydb-ui-layout';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import { ExternalPerson } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

export const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, crtSettings, related } = fetched;
    var { url } = useRouteMatch();
    
    var canEdit = permissions.hasCollectionFlag(
        'externalPerson', 'write'
    );

    var externalPersonBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = 'Datensatz-Details';
    return (
        <DetailsBox
            title={ title }
            editUrl={ `${up(url, 1)}/edit` }
            canEdit= { canEdit }
        >
            <ExternalPerson { ...externalPersonBag }>
                <ExternalPerson.SequenceNumber />
                <ExternalPerson.Custom />
                <ExternalPerson.SystemPermissions />
            </ExternalPerson>
        </DetailsBox>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody,
    shouldFetchSchema: false,
});
