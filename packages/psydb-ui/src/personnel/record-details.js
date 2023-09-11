import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { DetailsBox, LinkButton } from '@mpieva/psydb-ui-layout';

import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { Personnel } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

import { PersonnelParticipationList } from './personnel-participation-list';

const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, related } = fetched;
    
    var translate = useUITranslation();
    var { url } = useRouteMatch();
    
    var isRoot = permissions.isRoot();
    var canEdit = permissions.hasCollectionFlag('personnel', 'write');
    var canReadParticipation = permissions.hasFlag('canReadParticipation');

    var personnelBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        related
    }

    var isHidden = record.scientific.state.systemPermissions.isHidden;
    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = translate('Staff Member Details');
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

            { canReadParticipation && (
                <div className='border pl-3 bg-light mt-4 mb-4'>
                    <h5 className='d-flex justify-content-between align-items-start'>
                        <span className='d-inline-block pt-3'>
                            { translate('Past Appointments') }
                        </span>
                    </h5>
                    <hr />
                    <div className='pr-3 pb-3'>
                        <PersonnelParticipationList id={ record._id } />
                    </div>
                </div>
            )}
        </>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody: DetailsBody,
    shouldFetchCRTSettings: false,
    shouldFetchSchema: false,
});
