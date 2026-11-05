import React from 'react';

import { useRouteMatch  } from 'react-router-dom';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { DetailsBox } from '@mpieva/psydb-ui-layout';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';

import { ExternalPerson } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

export const DetailsBody = (ps) => {
    var { fetched, permissions } = ps;
    var { record, crtSettings, related } = fetched;
    
    var { url } = useRouteMatch();
    var [{ translate }] = useI18N();
    
    var canEdit = permissions.hasCollectionFlag(
        'externalPerson', 'write'
    );

    var externalPersonBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    var isHidden = record.state.systemPermissions.isHidden;

    return (
        <DetailsBox
            title={ translate('External Person Details') }
            editUrl={ `${up(url, 1)}/edit` }
            canEdit= { canEdit }
            isRecordHidden={ isHidden }
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
