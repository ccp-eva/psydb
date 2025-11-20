import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { DefaultRecordSideNav as Nav } from '@mpieva/psydb-ui-layout';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';

import SelectionSettings from './selection-settings';
import LabWorkflowSettings from './experiment-settings';
import LabTeams from './teams';
import Participation from './participation';

const IntraRecordRoutingBody = (ps) => {
    var {
        collection, recordType,
        fetched, permissions, revision,

        RecordDetails, RecordEditor, RecordRemover,
    } = ps;
    
    var { record, crtSettings } = fetched;
    var hasWorkflows = true; // FIXME

    var history = useHistory();
    var { path, url } = useRouteMatch();
    
    var [{ translate }] = useI18N();
    var permissions = usePermissions();
    var canReadParticipation = permissions.hasFlag('canReadParticipation');
    var canViewStudyLabOpsSettings = permissions.hasFlag('canViewStudyLabOpsSettings');

    var { hashurl, core } = Nav.useLinks({ record });
    
    var extra = {
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
            label: translate('Study Participation'),
            show: canReadParticipation, enabled: hasWorkflows
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

    return (
        <div className='d-flex'>
            <div className='flex-shrink-0'>
                <Nav.Container className='bg-light border'>
                    <Nav.LinkList links={ core } />
                    { Object.keys(extra).length > 0 && (
                        <Nav.LinkList links={ extra } />
                    )}
                </Nav.Container>
            </div>
            <div className='ml-2 flex-grow'>
                <Switch>
                    <Route exact path={`${path}`} render={ (ps) => (
                        <Redirect to={ `${url}/details` } />
                    )} />

                    <Route path={`${path}/details`}>
                        <RecordDetails { ...sharedBag } />
                    </Route>
                    
                    <Route path={`${path}/edit`}>
                        <RecordEditor
                            { ...sharedBag }
                            type='edit'
                            onSuccessfulUpdate={ ({ id }) => {
                                history.push(`${url}`)
                            }}
                        />
                    </Route>

                    <Route path={`${path}/selection-settings`}>
                        <SelectionSettings recordType={ recordType } />
                    </Route>
                    
                    <Route path={`${path}/experiment-settings`}>
                        <LabWorkflowSettings
                            studyType={ recordType }
                            onSuccessfulUpdate={ revision.up }
                        />
                    </Route>
                    
                    <Route path={`${path}/teams`}>
                        <LabTeams recordType={ recordType } />
                    </Route>
                    
                    <Route path={`${path}/participation`}>
                        <Participation recordType={ recordType } />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

const IntraRecordRouting = withRecordDetails({
    DetailsBody: IntraRecordRoutingBody,
    shouldFetchSchema: false,
})

export default IntraRecordRouting;
