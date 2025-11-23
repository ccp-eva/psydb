import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { FormBox } from '@mpieva/psydb-ui-layout';

import List from './list';
import RecordCreator from './record-creator';

const StudyConsentFormRouting = (ps) => {
    var { studyId } = ps;
    var { path, url } = useRouteMatch();
    var history =  useHistory();

    var [{ translate }] = useI18N();

    return (
        <Switch>
            <Route exact path={ path }>
                <div className='border p-3'>
                    <h5>{ translate('Consent Forms') }</h5>
                    <hr />
                    <List studyId={ studyId } />
                </div>
            </Route>
            <Route path={ `${path}/new` }>
                <FormBox title={ translate('New Consent Form') }>
                    <RecordCreator studyId={ studyId } />
                </FormBox>
            </Route>
        </Switch>
    )
}

export default StudyConsentFormRouting;
