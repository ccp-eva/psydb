import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { FormBox, DefaultRecordSideNav as Nav }
    from '@mpieva/psydb-ui-layout';

import SelectionSettings from './selection-settings';
import LabWorkflowSettings from './experiment-settings';
import LabTeams from './teams';
import Participation from './participation';
import ConsentFormsRouting from './consent-forms';
import * as StudyConsentDoc from '../study-consent-doc';

const IntraRecordRoutingBody = (ps) => {
    var {
        collection, recordType,
        fetched, permissions, revision,

        RecordDetails, RecordEditor, RecordRemover,
        RecordRawView, RecordRawHistory,
    } = ps;
    
    var { record, crtSettings } = fetched;
    var { _id: recordId } = record;
    var hasWorkflows = true; // FIXME

    var history = useHistory();
    var { path, url } = useRouteMatch();
    
    var [{ translate }] = useI18N();
    var permissions = usePermissions();
    var canReadParticipation = permissions.hasFlag('canReadParticipation');
    var canViewStudyLabOpsSettings = permissions.hasFlag('canViewStudyLabOpsSettings');

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
            show: canReadParticipation, enabled: hasWorkflows
        },
        [`#/lab-operation/reservation/${recordType}/${recordId}`]: {
            label: translate('Reservation'),
            show: true, enabled: hasWorkflows // FIXME
        },
    }

    var consentLinks = {
        [`${hashurl}/consent-forms`]: {
            label: translate('Consent Forms'),
            show: true, enabled: true
        },
        [`${hashurl}/consent-docs`]: {
            label: translate('Consent Docs'),
            show: true, enabled: true
        },
    }

    //var titleparts = [
    //    translate('Study Details'),
    //    ' - ',
    //    fetchedStudy.record.state.name
    //]
    //
    //if (!IS_WKPRC) {
    //    titleparts.push(' ', `(${fetchedStudy.record.state.shorthand})`)
    //}

    var sharedBag = { collection, recordType };

    var nav = (
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

    var content = (
        <Switch>
            <Route exact path={`${path}`} render={ (ps) => (
                <Redirect to={ `${url}/details` } />
            )} />

            <Route path={`${path}/details`}>
                <RecordDetails { ...sharedBag } />
            </Route>
            
            <Route path={`${path}/edit`}>
                <FormBox title={ translate('Edit Details') }>
                    <RecordEditor
                        { ...sharedBag }
                        type='edit'
                        onSuccessfulUpdate={ ({ id }) => {
                            history.push(`${url}`)
                        }}
                    />
                </FormBox>
            </Route>
            
            <Route path={`${path}/raw`}>
                <RecordRawView { ...sharedBag } prefetched={ fetched }/>
            </Route>
            <Route path={`${path}/raw-history`}>
                <RecordRawHistory { ...sharedBag } prefetched={ fetched } />
            </Route>

            <Route path={`${path}/selection-settings`}>
                <FormBox title={ translate('Selection Settings') }>
                    <SelectionSettings recordType={ recordType } />
                </FormBox>
            </Route>
            
            <Route path={`${path}/experiment-settings`}>
                <FormBox title={ translate('Lab Workflow Settings') }>
                    <LabWorkflowSettings
                        studyType={ recordType }
                        onSuccessfulUpdate={ revision.up }
                    />
                </FormBox>
            </Route>
            
            <Route path={`${path}/teams`}>
                <FormBox title={ translate('Teams') }>
                    <LabTeams recordType={ recordType } />
                </FormBox>
            </Route>
            
            <Route path={`${path}/participation`}>
                <div className='border p-3'>
                    <h5>{ translate('Study Participations') }</h5>
                    <hr />
                    <Participation recordType={ recordType } />
                </div>
            </Route>
            
            <Route path={`${path}/consent-forms`}>
                <ConsentFormsRouting studyId={ recordId } />
            </Route>
            <Route path={`${path}/consent-docs`}>
                <StudyConsentDoc.Routing studyId={ recordId } />
            </Route>
        </Switch>
    );

    return (
        <Wrapper
            title={ translate('Study') + ': ' + record._recordLabel }
            nav={ nav } content={ content }
        />
    )
}

var Wrapper = (ps) => {
    var { title, nav, content } = ps;

    return (
        <>
            <h5 className='border-bottom mb-1'>
                <b>{ title }</b>
            </h5>
            <div className='d-flex'>
                <div className='flex-shrink-0'>
                    { nav }
                </div>
                <div className='ml-2 flex-grow'>
                    { content }
                </div>
            </div>
        </>
    )
}

const IntraRecordRouting = withRecordDetails({
    DetailsBody: IntraRecordRoutingBody,
    shouldFetchSchema: false,
})

export default IntraRecordRouting;
