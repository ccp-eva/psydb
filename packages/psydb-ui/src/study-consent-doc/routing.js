import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { FormBox } from '@mpieva/psydb-ui-layout';

import List from './list';
import RecordCreator from './record-creator';
import RecordDetails from './record-details';

const StudyConsentDocRouting = (ps) => {
    var { studyId, subjectId, ListWrapper = DefaultListWrapper } = ps;
    var { path, url } = useRouteMatch();
    var history =  useHistory();

    var [{ translate }] = useI18N();

    return (
        <Switch>
            <Route exact path={ path }>
                <ListWrapper>
                    <List studyId={ studyId } subjectId={ subjectId } />
                </ListWrapper>
            </Route>
            { studyId && (
                <Route path={ `${path}/new` }>
                    <FormBox title={ translate('New Consent Doc') }>
                        <RecordCreator
                            studyId={ studyId }
                            onSuccessfulUpdate={ () => history.push(`${url}`) }
                            enableFullScreenLink={ true }
                        />
                    </FormBox>
                </Route>
            )}
            <Route path={ `${path}/:studyConsentDocId` }>
                <FormBox title={ translate('Consent Doc Details') }>
                    <RecordDetails />
                </FormBox>
            </Route>
        </Switch>
    )
}

const DefaultListWrapper = (ps) => {
    var { children } = ps;
    var [{ translate }] = useI18N();

    return (
        <div className='border p-3 bg-light'>
            <h5>{ translate('Consent Docs') }</h5>
            <hr />
            { children }
        </div>
    )
}

export default StudyConsentDocRouting;
