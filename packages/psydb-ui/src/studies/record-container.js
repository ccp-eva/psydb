import React, { useEffect, useReducer } from 'react';
import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    useRevision,
    usePermissions,
    useFetch,
    useReadRecord
} from '@mpieva/psydb-ui-hooks';

import {
    TabNav,
    LinkButton,
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

import StudyRecordDetails from './record-details';
import RecordEditor from './record-editor';
import StudySelectionSettings from './selection-settings';

import ExperimentSettings from './experiment-settings';
import StudyTeams from './teams';
import StudyParticipation from './participation';

const StudyRecordRouting = (ps) => {
    var { recordType } = ps;
    var { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <Redirect to={ `${url}/details` } />
            </Route>
            <Route path={`${path}/:tabKey`}>
                <StudyRecordContainer recordType={ recordType } />
            </Route>
        </Switch>
    )
}

const StudyRecordContainer = (ps) => {
    var { recordType } = ps;

    var { path, url } = useRouteMatch();
    var { id, tabKey } = useParams();
    var history =  useHistory();

    var translate = useUITranslation();
    var permissions = usePermissions();
    var canReadParticipation = permissions.hasFlag('canReadParticipation');

    var revision = useRevision();
    var [ didFetchStudy, fetchedStudy ] = useReadRecord({
        collection: 'study',
        recordType,
        id,
    }, [ revision.value ]);

    var [ didFetchSettings, fetchedSettings ] = useFetch((agent) => (
        agent.fetchExperimentVariantSettings({
            studyId: id
        })
    ), [ revision.value ])

    if (!didFetchStudy || !didFetchSettings) {
        return <LoadingIndicator size='lg' />
    }

    var navItems = [
        {
            key: 'details',
            label: translate('General')
        },
        {
            key: 'selection-settings',
            label: translate('Selection Settings')
        },
        {
            key: 'experiment-settings',
            label: translate('Lab Workflow Settings')
        },
        {
            key: 'teams',
            label: translate('Teams')
        },
        canReadParticipation && (
            { 
                key: 'participation',
                label: translate('Study Participation') + '(Temporarily Disabled)',
                disabled: true || fetchedSettings.data.records.length < 1,
            }
        ),
    ].filter(it => !!it);

    return (
        <>
            <div className='border pl-3 bg-light'>
                <h5
                    className='d-flex justify-content-between align-items-end'
                    style={{ minHeight: '38px' }}
                >
                    { translate('Study Details') }
                    {' - '}
                    { fetchedStudy.record.state.name }
                    {' '}
                    ({ fetchedStudy.record.state.shorthand })
                </h5>
                <hr />

                <div className='pr-3'>
                    <TabNav
                        className='d-flex'
                        itemClassName='flex-grow'
                        activeKey={ tabKey }
                        items={ navItems }
                        onItemClick={ (nextKey) => {
                            history.push(`${up(url, 1)}/${nextKey}`)
                        }}
                    />

                    { tabKey === 'details' && (
                        <Switch>
                            <Route exact path={path}>
                                <StudyRecordDetails
                                    recordType={ recordType }
                                    fetched={ fetchedStudy }
                                />
                            </Route>
                            <Route exact path={`${path}/edit`}>
                                <RecordEditor
                                    collection='study'
                                    recordType={ recordType }
                                    onSuccessfulUpdate={ () => {
                                        revision.up();
                                        history.push(`${url}`);
                                    }}
                                />
                            </Route>
                        </Switch>
                    )}

                    { tabKey === 'selection-settings' && (
                        <StudySelectionSettings
                            recordType={ recordType }
                        />
                    )}

                    { tabKey === 'experiment-settings' && (        
                        <ExperimentSettings
                            studyType={ recordType }
                            onSuccessfulUpdate={ revision.up }
                        />
                    )}

                    { tabKey === 'teams' && (        
                        <StudyTeams
                            recordType={ recordType }
                        />
                    )}

                    { canReadParticipation && tabKey === 'participation' && (
                        <StudyParticipation
                            recordType={ recordType }
                        />
                    )}

                </div>
            </div>
        </>
    )
}

export default StudyRecordRouting;
