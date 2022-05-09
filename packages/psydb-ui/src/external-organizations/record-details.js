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

    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = 'Datensatz-Details';
    return (
        <>
            <DetailsBox
                title={ title }
                editUrl={ `${up(url, 1)}/edit` }
                canEdit= { canEdit }
            >
                <ExternalOrganization { ...externalOrganizationBag }>
                    <ExternalOrganization.SequenceNumber />
                    <ExternalOrganization.Custom />
                    <ExternalOrganization.SystemPermissions />
                </ExternalOrganization>
            </DetailsBox>
            
            { isRoot && (
                <div className='mt-4 mb-4'>
                    <LinkButton
                        variant='danger'
                        to={`${up(url, 1)}/remove` }
                    >
                        Externe Organisation Löschen
                    </LinkButton>
                </div>
            )}
        </>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody,
    shouldFetchSchema: false,
});
