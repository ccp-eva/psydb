import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { DetailsBox, LinkButton } from '@mpieva/psydb-ui-layout';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import { SubjectGroup } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, related } = fetched;
    var { url } = useRouteMatch();
    var translate = useUITranslation();
    
    var canEdit = permissions.hasCollectionFlag('subjectGroup', 'write');

    var subjectGroupBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        related
    }

    var title = translate('Subject Group Details')
    return (
        <>
            <DetailsBox
                title={ title }
                editUrl={ `${up(url, 1)}/edit` }
                canEdit= { canEdit }
            >
                <SubjectGroup { ...subjectGroupBag }>
                    <SubjectGroup.SubjectType />
                    <SubjectGroup.LocationType />
                    <SubjectGroup.LocationId />
                    <SubjectGroup.Name />
                    <SubjectGroup.Comment />
                </SubjectGroup>
            </DetailsBox>
        </>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody: DetailsBody,
    shouldFetchCRTSettings: false,
    shouldFetchSchema: false,
});
