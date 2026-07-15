import React from 'react';
import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { DefaultRecordSideNav as Nav } from '@mpieva/psydb-ui-layout';

const IntraRecordNav = (ps) => {
    var { fetched } = ps;
    var { record, crtSettings } = fetched.data;

    var { _id: recordId, type: recordType } = record;
    var hasLabWorkflows = true; // FIXME
    
    var [{ translate }] = useI18N();
    var { dev_enableStudyConsentWorkflow } = useUIConfig();
    
    var permissions = usePermissions();
    // FIXME: flags will be 'undefined' when no rg has it,
    //        but we need expelicit false for everything
    //        or else nav link 'show = true' override breaks this
    // XXX: doesnt work well with root
    //var {
    //    canReadParticipation = false, canViewStudyLabOpsSettings = false,
    //    canReadStudyConsentDocs = false, canReadStudyConsentForms = false,
    //} = permissions.getFlags();

    var canReadParticipation = permissions.hasFlag('canReadParticipation');
    var canViewStudyLabOpsSettings = permissions.hasFlag('canViewStudyLabOpsSettings');
    var canReadStudyConsentDocs = permissions.hasFlag('canReadStudyConsentDocs');
    var canReadStudyConsentForms = permissions.hasFlag('canReadStudyConsentForms');

    var { hashurl, core, raw } = Nav.useLinks({ record });
   
    core[`${hashurl}/details`].label = translate('Details');
    core[`${hashurl}/edit`].label = translate('Edit Details');

    var settingsLinks = {
        [`${hashurl}/selection-settings`]: {
            label: translate('Selection Settings'),
            show: crtSettings.enableSubjectSelectionSettings, enabled: true
        },
        [`${hashurl}/experiment-settings`]: {
            label: translate('Lab Workflow Settings'),
            show: canViewStudyLabOpsSettings, enabled: true
        },
        [`${hashurl}/teams`]: {
            label: translate('Teams'),
            show: crtSettings.enableLabTeams, enabled: true
        },
        [`${hashurl}/participation`]: {
            label: translate('Study Participations'),
            show: canReadParticipation, enabled: hasLabWorkflows
        },
        [`#/lab-operation/reservation/${recordType}/${recordId}`]: {
            label: translate('Reservation'),
            show: true, enabled: hasLabWorkflows // FIXME
        },
    }

    var consentLinks = dev_enableStudyConsentWorkflow ? {
        [`${hashurl}/consent-forms`]: {
            label: translate('Consent Forms'),
            show: canReadStudyConsentForms, enabled: true
        },
        [`${hashurl}/consent-docs`]: {
            label: translate('Consent Docs'),
            show: canReadStudyConsentDocs, enabled: true
        },
    } : {}; // FIXME dont like it Nav.hasLinks() ??
    
    return (
        <Nav.Container className='bg-light border'>
            <Nav.LinkList links={ core } />
            { Object.keys(settingsLinks).length > 0 && (
                <>
                    <Nav.HR />
                    <Nav.LinkList links={ settingsLinks } />
                </>
            )}
            { Object.keys(consentLinks).length > 0 && (
                <>
                    <Nav.HR />
                    <Nav.LinkList links={ consentLinks } />
                </>
            )}
            { permissions.isRoot() && (
                <>
                    <Nav.HR />
                    <Nav.LinkList links={ raw } />
                </>
            )}
        </Nav.Container>
    );
}

export default IntraRecordNav;
