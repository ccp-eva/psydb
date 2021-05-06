import React, { useEffect, useReducer } from 'react';
import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';
import { ArrowRightShort } from 'react-bootstrap-icons';

import agent from '@mpieva/psydb-ui-request-agents';
import up from '@mpieva/psydb-ui-lib/src/url-up';

import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';

import StudyRecordDetails from './record-details';
import StudyTeams from './teams';
import StudyParticipation from './participation';

const StudyRecordRouting = ({
    recordType,
}) => {
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

const EditLinkButton = ({
    to,
    label
}) => {
    return (
        <LinkButton
            className='d-flex align-items-center'
            to={ to }>
            <span className='d-inline-block mr-2'>{ label }</span>
            <ArrowRightShort style={{ height: '24px', width: '24px' }} />
        </LinkButton>
    );
}

const StudyRecordContainer = ({
    recordType
}) => {
    var { path, url } = useRouteMatch();
    var { id, tabKey } = useParams();
    var history =  useHistory();

    return (
        <>
            <div className='border pl-3 bg-light'>
                <h5
                    className='d-flex justify-content-between align-items-end'
                    style={{ minHeight: '38px' }}
                >
                    <span>Studien-Details</span>
                    { tabKey === 'details' && (
                        <EditLinkButton
                            label='Bearbeiten'
                            to={ `${url}/edit` }
                        />
                    )}
                    { tabKey === 'selection-settings' && (
                        <EditLinkButton
                            label='Bearbeiten'
                            to={ `${url}/edit` }
                        />
                    )}
                </h5>
                <hr />

                <div className='pr-3'>
                    <TabNav
                        className='d-flex'
                        itemClassName='flex-grow'
                        activeKey={ tabKey }
                        items={[
                            { key: 'details', label: 'Details' },
                            { key: 'selection-settings', label: 'Auswahlbedingungen' },
                            { key: 'teams', label: 'Teams' },
                            { key: 'participation', label: 'Probanden' },
                        ]}
                        onItemClick={ (nextKey) => {
                            history.push(`${up(url, 1)}/${nextKey}`)
                        }}
                    />

                    { tabKey === 'details' && (
                        <Switch>
                            <Route exact path={path}>
                                <StudyRecordDetails
                                    recordType={ recordType }
                                />
                            </Route>
                            {/*<Route exact path={`${path}/edit`}>
                                <StudyRecordForm
                                    recordType={ recordType }
                                />
                            </Route>*/}
                        </Switch>
                    )}

                    { tabKey === 'teams' && (        
                        <StudyTeams
                            recordType={ recordType }
                        />
                    )}

                    { tabKey === 'participation' && (        
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
