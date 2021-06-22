import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import up from '@mpieva/psydb-ui-lib/src/url-up';
import BigNav from '@mpieva/psydb-ui-lib/src/big-nav';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';

import ReservationRouting from './reservation';
import SubjectSelectionRouting from './subject-selection';
import InviteConfirmationRouting from './invite-confirmation';
import ExperimentPostprocessingRouting from './experiment-postprocessing';

const LabOperation = () => {
    var { path, url } = useRouteMatch();

    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ metadata, setMetadata ] = useState();

    useEffect(() => {
        agent.readCustomRecordTypeMetadata().then(
            (response) => {
                setMetadata(response.data.data);
                setIsInitialized(true)
            }
        )
    }, [])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    var studyTypes = (
        metadata.customRecordTypes.filter(it => (
            it.collection ===  'study'
        ))
    );

    var subjectTypes = (
        metadata.customRecordTypes.filter(it => (
            it.collection ===  'subject'
        ))
    );

    return (
        <div>
            <header>
                <h1 className='mb-0 border-bottom'>
                    Studienbetrieb
                </h1>
            </header>
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/index` }
                        studyTypes={ studyTypes }
                    />
                </Route>
                <Route exact path={`${path}/index/:studyType`}>
                    <OperationNav />
                </Route>

                <Route exact path={`${path}/reservation`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/reservation` }
                        studyTypes={ studyTypes }
                    />
                </Route>
                <Route path={`${path}/reservation/:studyType`}>
                    <ReservationRouting
                        customRecordTypes={ metadata.customRecordTypes }
                    />
                </Route>

                <Route exact path={`${path}/subject-selection`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/subject-selection` }
                        studyTypes={ studyTypes }
                    />
                </Route>
                <Route path={`${path}/subject-selection/:studyType`}>
                    <SubjectSelectionRouting />
                </Route>

                <Route exact path={`${path}/invite-confirmation`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/invite-confirmation` }
                        studyTypes={ studyTypes }
                    />
                </Route>
                <Route path={`${path}/invite-confirmation/:studyType`}>
                    <InviteConfirmationRouting
                        subjectRecordTypes={ subjectTypes }
                    />
                </Route>

                <Route exact path={`${path}/experiment-postprocessing`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/experiment-postprocessing` }
                        studyTypes={ studyTypes }
                    />
                </Route>
                <Route path={`${path}/experiment-postprocessing/:studyType`}>
                    <ExperimentPostprocessingRouting
                        subjectRecordTypes={ subjectTypes }
                    />
                </Route>

            </Switch>
        </div>

    )
}

const RedirectOrTypeNav = ({
    baseUrl,
    studyTypes,
    title,
}) => {
    if (studyTypes.length === 1) {
        return (
            <Redirect to={
                `${baseUrl}/${studyTypes[0].type}`
            } />
        )
    }
    else {
        return (
            <>
                { title && (
                    <h2>{ title }</h2>
                )}
                <RecordTypeNav items={ studyTypes } />
            </>
        )
    }
}

const OperationNav = () => {
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();

    console.log(url);
    var baseUrl = up(url, 2);
    console.log(baseUrl);

    return (
        <BigNav items={[
            { 
                label: 'Reservierung',
                linkUrl: `${baseUrl}/reservation/${studyType}`,
            },
            { 
                label: 'Probandenauswahl',
                linkUrl: `${baseUrl}/subject-selection/${studyType}`,
            },
            {
                label: 'Terminbestätigung',
                linkUrl: `${baseUrl}/invite-confirmation/${studyType}`,
            },
            {
                label: 'Nachbereitung',
                linkUrl: `${baseUrl}/experiment-postprocessing/${studyType}`,
            },
        ]} />
    );
}

export default LabOperation;
