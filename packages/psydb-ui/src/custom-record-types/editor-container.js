import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { URL } from '@mpieva/psydb-ui-utils';
import { withRecordEditor } from '@mpieva/psydb-ui-lib';
import { RoutedTabNav, LinkButton } from '@mpieva/psydb-ui-layout';

import DirtyAlert from './dirty-alert';
import LiveDataEditor from './live-data-editor';
import FieldEditor from './field-editor';

const Inner = (ps) => {
    var {
        collection,
        id,
        fetched,
        revision,

        removeUrl,
    } = ps;

    var {
        record,
        schema,
        related
    } = fetched;

    var { path, url } = useRouteMatch();

    return (
        <>
            <div>
                <div className='d-flex'>
                    <div style={{ width: '25%'}}>Collection</div>
                    <div><b>{ record.collection }</b></div>
                </div>
                <div className='d-flex'>
                    <div style={{ width: '25%'}}>Interner Type-Key</div>
                    <div><b>{ record.type }</b></div>
                </div>
            </div>

            { record.state.isNew && (
                <div>NEW RECORD TYPE</div>
            )}
            { record.state.isDirty && (
                <DirtyAlert />
            )}
            
            <hr />

            <BaseRouting>
                <div className='p-3 border-left border-bottom border-right'>
                    <Route path={ `${path}/fields` }>
                        <FieldEditor
                            record={ record }
                            onSuccessfulUpdate={ revision.up }
                        />
                    </Route>
                    <Route path={ `${path}/live` }>
                        <LiveDataEditor
                            record={ record }
                            onSuccessfulUpdate={ revision.up }
                        />
                    </Route>
                </div>
            </BaseRouting>
            
            <hr />

            <LinkButton
                variant='danger'
                to={ URL.fill(removeUrl, { id }) }
            >
                Löschen
            </LinkButton>
        </>
    );
}

const BaseRouting = (ps) => {
    var { children } = ps;
    var { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <Redirect to={`${url}/live`} />
            </Route>
            <Route path={ `${path}/:tabKey` }>
                
                <RoutedTabNav
                    param='tabKey'
                    className='d-flex'
                    itemClassName='flex-grow'
                    items={[
                        { key: 'live', label: 'Live-Settings' },
                        { key: 'fields', label: 'Feld-Editor' },
                    ]}
                />

                { children }
            </Route>
        </Switch>
    );
}

const RecordEditor = withRecordEditor({
    EditForm: Inner,
    shouldFetchSchema: false,
    shouldFetchCRTSettings: false
})

export default RecordEditor;
