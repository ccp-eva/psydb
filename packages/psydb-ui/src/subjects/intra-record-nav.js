import React from 'react';
import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { DefaultRecordSideNav as Nav } from '@mpieva/psydb-ui-layout';

const IntraRecordNav = (ps) => {
    var { fetched } = ps;
    var { record } = fetched;

    var [{ translate }] = useI18N();
    var { dev_enableCSVSubjectContactHistoryImport = false } = useUIConfig();
    var permissions = usePermissions();

    var canEdit = permissions.hasCollectionFlag('subject', 'write');
    var canHistory = permissions.isRoot();
    var canReadParticipation = permissions.hasFlag('canReadParticipation');

    var { hashurl, core } = Nav.useLinks({ record });

    core[`${hashurl}/details`].label = translate('Details');
    core[`${hashurl}/edit`].label = translate('Edit Details');
    core[`${hashurl}/edit`].show = canEdit;

    var activityLinks = {
        [`${hashurl}/participation`]: {
            label: translate('Study Participation'),
            show: canReadParticipation, enabled: true
        },
        [`${hashurl}/contact-history`]: {
            label: translate('Contact History'),
            show: dev_enableCSVSubjectContactHistoryImport, enabled: true
        },
    };
    var hasActivityLinks = (
        Object.values(activityLinks).some(it => it.show)
    );

    var extraLinks = {
        [`${hashurl}/channel-history`]: {
            label: translate('History'),
            show: canHistory, enabled: true
        },
    };
    var hasExtraLinks = Object.values(extraLinks).some(it => it.show);

    return (
        <Nav.Container className='bg-light border'>
            <Nav.LinkList links={ core } />
            { hasActivityLinks && (
                <>
                    <Nav.HR />
                    <Nav.LinkList links={ activityLinks } />
                </>
            )}
            { hasExtraLinks && (
                <>
                    <Nav.HR />
                    <Nav.LinkList links={ extraLinks } />
                </>
            )}
        </Nav.Container>
    );
}

export default IntraRecordNav;
