import React from 'react';

import { useRouteMatch  } from 'react-router-dom';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { DetailsBox, LinkButton } from '@mpieva/psydb-ui-layout';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import { ExternalOrganization } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

export const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, crtSettings, related } = fetched;
    var { url } = useRouteMatch();
    
    var isRoot = permissions.isRoot();

    var canEdit = permissions.hasCollectionFlag(
        'externalOrganization', 'write'
    );

    var externalOrganizationBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    var isHidden = record.state.systemPermissions.isHidden;

    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = 'Externe-Organisation-Details';
    return (
        <>
            <DetailsBox
                title={ title }
                editUrl={ `${up(url, 1)}/edit` }
                canEdit= { canEdit }
                isRecordHidden={ isHidden }
            >
                <ExternalOrganization { ...externalOrganizationBag }>
                    <ExternalOrganization.SequenceNumber />
                    <ExternalOrganization.Custom />
                    <ExternalOrganization.SystemPermissions />
                </ExternalOrganization>
            </DetailsBox>
        </>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody,
    shouldFetchSchema: false,
});
