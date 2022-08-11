import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { DetailsBox, LinkButton } from '@mpieva/psydb-ui-layout';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import { Personnel } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, related } = fetched;
    var { url } = useRouteMatch();
    
    var isRoot = permissions.isRoot();
    var canEdit = permissions.hasCollectionFlag('personnel', 'write');

    var personnelBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        related
    }

    var isHidden = record.scientific.state.systemPermissions.isHidden;
    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = 'Mitarbeiter:in-Details';
    return (
        <>
            <DetailsBox
                title={ title }
                editUrl={ `${up(url, 1)}/edit` }
                canEdit= { canEdit }
                isRecordHidden={ isHidden }
            >
                <Personnel { ...personnelBag }>
                    <Personnel.SequenceNumber />
                    <Personnel.Firstname />
                    <Personnel.Lastname />
                    <Personnel.Emails />
                    <Personnel.Phones />
                    <Personnel.Description />
                    <Personnel.ResearchGroupSettings />
                    <Personnel.SystemPermissions />
                </Personnel>
            </DetailsBox>
        </>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody: DetailsBody,
    shouldFetchCRTSettings: false,
    shouldFetchSchema: false,
});
