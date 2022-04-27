import React from 'react';

import { FormBox, withRecordDetails } from '@mpieva/psydb-ui-lib';
import { useRouteMatch  } from 'react-router-dom';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import { Location } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

export const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, crtSettings, related } = fetched;
    var { url } = useRouteMatch();
    
    var canEdit = permissions.hasCollectionFlag('location', 'write');

    var locationBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = 'Datensatz-Details';
    return (
        <FormBox title={ title }>
            <Location { ...locationBag }>
                <Location.SequenceNumber />
                <Location.Custom />
            </Location>
        </FormBox>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody,
    shouldFetchSchema: false,
});
