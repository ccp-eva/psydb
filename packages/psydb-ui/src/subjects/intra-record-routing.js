import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';

import IntraRecordNav from './intra-record-nav';
import SubjectParticipation from './participation';
import SubjectContactHistory from './contact-history';

const IntraRecordRoutingBody = (ps) => {
    var {
        collection, recordType,
        fetched, revision, permissions,

        RecordDetails, RecordHistory, RecordEditor,
        RecordRemover, RecordAnonymizer,
    } = ps;

    var { record } = fetched;
    var canReadParticipation = permissions.hasFlag('canReadParticipation');
    var { dev_enableCSVSubjectContactHistoryImport = false } = useUIConfig();

    var [{ translate }] = useI18N();
    var history = useHistory();
    var { path, url } = useRouteMatch();

    var nav = <IntraRecordNav fetched={ fetched } />

    var sharedBag = { collection, recordType };
    var content = (
        <Switch>
            <Route exact path={`${path}`} render={ (ps) => (
                <Redirect to={ `${url}/details` } />
            )} />

            <Route path={`${path}/details`}>
                <RecordDetails { ...sharedBag } />
            </Route>

            { canReadParticipation && (
                <Route path={`${path}/participation`}>
                    <SubjectParticipation { ...sharedBag } />
                </Route>
            )}

            { dev_enableCSVSubjectContactHistoryImport && (
                <Route path={`${path}/contact-history`}>
                    <SubjectContactHistory { ...sharedBag } />
                </Route>
            )}

            <Route path={`${path}/channel-history`}>
                <RecordHistory { ...sharedBag } />
            </Route>

            <Route path={`${path}/edit`}>
                <RecordEditor
                    { ...sharedBag }
                    type='edit'
                    onSuccessfulUpdate={ () => {
                        revision.up();
                        history.push(`${url}`);
                    }}
                />
            </Route>

            <Route path={`${path}/remove`}>
                <RecordRemover
                    { ...sharedBag }
                    type='edit'
                    successInfoBackLink={ `#${up(url, 1)}` }
                    onSuccessfulUpdate={ () => {
                        history.push(`${url}/remove/success`)
                    }}
                />
            </Route>

            <Route path={`${path}/clean-gdpr`}>
                <RecordAnonymizer
                    { ...sharedBag }
                    successInfoBackLink={ `#${up(url, 1)}` }
                    onSuccessfulUpdate={ () => {
                        history.push(`${url}/clean-gdpr/success`)
                    }}
                />
            </Route>
        </Switch>
    );

    return (
        <Wrapper
            title={ translate('Subject') + ': ' + record._recordLabel }
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
                <div className='ml-2 flex-grow-1'>
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
