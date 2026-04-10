import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { withFetchOne } from '@mpieva/psydb-ui-lib';
import { FormBox } from '@mpieva/psydb-ui-layout';

import IntraRecordNav from './intra-record-nav';
import SelectionSettings from './selection-settings';
import LabWorkflowSettings from './experiment-settings';
import LabTeams from './teams';
import Participation from './participation';
import ConsentFormsRouting from './consent-forms';
import * as StudyConsentDoc from '../study-consent-doc';

const IntraRecordRoutingBody = (ps) => {
    var {
        fetched, revision, permissions,
        RecordDetails, RecordEditor, RecordRemover,
        RecordRawView, RecordRawHistory,
    } = ps;
    
    var { record, crtSettings } = fetched.data;
    var { _id: recordId, type: recordType } = record;
    var hasLabWorkflows = true; // FIXME

    var { dev_enableStudyConsentWorkflow } = useUIConfig();

    var history = useHistory();
    var { path, url } = useRouteMatch();
    
    var [{ translate }] = useI18N();
    var permissions = usePermissions();
    var canReadParticipation = permissions.hasFlag('canReadParticipation');
    var canViewStudyLabOpsSettings = permissions.hasFlag('canViewStudyLabOpsSettings');


    //var titleparts = [
    //    translate('Study Details'),
    //    ' - ',
    //    fetchedStudy.record.state.name
    //]
    //
    //if (!IS_WKPRC) {
    //    titleparts.push(' ', `(${fetchedStudy.record.state.shorthand})`)
    //}

    var nav = <IntraRecordNav fetched={ fetched } />

    var sharedBag = { collection: 'study', recordType };
    var content = (
        <Switch>
            <Route exact path={`${path}`} render={ (ps) => (
                <Redirect to={ `${url}/details` } />
            )} />

            <Route path={`${path}/details`}>
                <RecordDetails { ...sharedBag } fetched={ fetched } />
            </Route>
            
            <Route path={`${path}/edit`}>
                <FormBox title={ translate('Edit Details') }>
                    <RecordEditor
                        { ...sharedBag }
                        type='edit'
                        fetched={ fetched }
                        onSuccessfulUpdate={ ({ id }) => {
                            revision.up();
                            history.push(`${url}`);
                        }}
                    />
                </FormBox>
            </Route>
           
            { crtSettings.enableSubjectSelectionSettings && (
                <Route path={`${path}/selection-settings`}>
                    <FormBox title={ translate('Selection Settings') }>
                        <SelectionSettings recordType={ recordType } />
                    </FormBox>
                </Route>
            )}
            
            { canViewStudyLabOpsSettings && (
                <Route path={`${path}/experiment-settings`}>
                    <FormBox title={ translate('Lab Workflow Settings') }>
                        <LabWorkflowSettings
                            studyType={ recordType }
                            onSuccessfulUpdate={ revision.up }
                        />
                    </FormBox>
                </Route>
            )}
            
            { crtSettings.enableLabTeams && (
                <Route path={`${path}/teams`}>
                    <FormBox title={ translate('Teams') }>
                        <LabTeams recordType={ recordType } />
                    </FormBox>
                </Route>
            )}
           
            { (canReadParticipation && hasLabWorkflows) && (
                <Route path={`${path}/participation`}>
                    <div className='border p-3'>
                        <h5>{ translate('Study Participations') }</h5>
                        <hr />
                        <Participation recordType={ recordType } />
                    </div>
                </Route>
            )}
            
            { dev_enableStudyConsentWorkflow && (
                <Route path={`${path}/consent-forms`}>
                    <ConsentFormsRouting studyId={ recordId } />
                </Route>
            )}
            { dev_enableStudyConsentWorkflow && (
                <Route path={`${path}/consent-docs`}>
                    <StudyConsentDoc.Routing studyId={ recordId } />
                </Route>
            )}
            
            { permissions.isRoot() && (
                <Route path={`${path}/raw`}>
                    <RecordRawView
                        { ...sharedBag } prefetched={ fetched } />
                </Route>
            )}
            { permissions.isRoot() && (
                <Route path={`${path}/raw-history`}>
                    <RecordRawHistory
                        { ...sharedBag } prefetched={ fetched } />
                </Route>
            )}

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

const IntraRecordRouting = withFetchOne({
    Body: IntraRecordRoutingBody,
    access: [{ collection: 'study', level: 'read' }],
    agentFN: '/study/read', paramKeys: [ 'id' ]
})

export default IntraRecordRouting;
