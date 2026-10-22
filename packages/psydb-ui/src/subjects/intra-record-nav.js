import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { DefaultRecordSideNav as Nav } from '@mpieva/psydb-ui-layout';

const IntraRecordNav = (ps) => {
    var { fetched } = ps;
    var { record } = fetched;

    var [{ translate }] = useI18N();
    var permissions = usePermissions();

    var canEdit = permissions.hasCollectionFlag('subject', 'write');
    var canHistory = permissions.isRoot();
    var canReadParticipation = permissions.hasFlag('canReadParticipation');

    var { hashurl, core } = Nav.useLinks({ record });

    core[`${hashurl}/details`].label = translate('Details');
    core[`${hashurl}/edit`].label = translate('Edit Details');
    core[`${hashurl}/edit`].show = canEdit;

    var participationLinks = {
        [`${hashurl}/participation`]: {
            label: translate('Study Participation'),
            show: canReadParticipation, enabled: true
        },
    };
    var hasParticipationLinks = (
        Object.values(participationLinks).some(it => it.show)
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
            { hasParticipationLinks && (
                <>
                    <Nav.HR />
                    <Nav.LinkList links={ participationLinks } />
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
