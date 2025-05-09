import React from 'react';
import { useRouteMatch  } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { DetailsBox } from '@mpieva/psydb-ui-layout';

import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { Location } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

export const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, crtSettings, related } = fetched;
    var { url } = useRouteMatch();
    var translate = useUITranslation();
    
    var canEdit = permissions.hasCollectionFlag('location', 'write');

    var locationBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    var isHidden = record.state.systemPermissions.isHidden;

    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = translate('Location Details');
    return (
        <DetailsBox
            title={ title }
            editUrl={ `${up(url, 1)}/edit` }
            canEdit= { canEdit }
            isRecordHidden={ isHidden }
        >
            <Location { ...locationBag }>
                <Location.SequenceNumber />
                <Location.Custom />
                <Location.Comment />
                <Location.ReservationSettings />
                <Location.SystemPermissions />
            </Location>
        </DetailsBox>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody,
    shouldFetchSchema: false,
});
