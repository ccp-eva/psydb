import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { DetailsBox } from '@mpieva/psydb-ui-layout';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import { ResearchGroup } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, related } = fetched;
    var { url } = useRouteMatch();
    
    var canEdit = permissions.hasCollectionFlag('researchGroup', 'write');

    var researchGroupBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        related
    }

    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = 'Datensatz-Details';
    return (
        <>
            <DetailsBox
                title={ title }
                editUrl={ `${up(url, 1)}/edit` }
                canEdit= { canEdit }
            >
                <ResearchGroup { ...researchGroupBag }>
                    <ResearchGroup.SequenceNumber />
                    <ResearchGroup.Name />
                    <ResearchGroup.Shorthand />
                    <ResearchGroup.Address />
                    <ResearchGroup.Description />
                </ResearchGroup>
            </DetailsBox>
        </>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody: DetailsBody,
    shouldFetchCRTSettings: false,
    shouldFetchSchema: false,
});
