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
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { RoutedTabNav, LinkButton } from '@mpieva/psydb-ui-layout';
import { withRecordEditor } from '@mpieva/psydb-ui-lib';

import IsDirtyAlert from './is-dirty-alert';
import IsNewAlert from './is-new-alert';
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

    var { record, schema, related } = fetched;
    var { collection, type, state } = record;
    var { isNew, isDirty } = state;

    var { path, url } = useRouteMatch();
    var translate = useUITranslation();

    return (
        <>
            <div>
                <div className='d-flex'>
                    <div style={{ width: '25%'}}>
                        { translate('Collection') }
                    </div>
                    <div>
                        <b>{ collection }</b>
                    </div>
                </div>
                <div className='d-flex'>
                    <div style={{ width: '25%'}}>
                        { translate('Internal Type Key') }
                    </div>
                    <div>
                        <b>{ type }</b>
                    </div>
                </div>
            </div>

            { isNew && (
                <IsNewAlert />
            )}
            { !isNew && isDirty && (
                <IsDirtyAlert />
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
                { translate('Delete') }
            </LinkButton>
        </>
    );
}

const BaseRouting = (ps) => {
    var { children } = ps;
    
    var { path, url } = useRouteMatch();
    var translate = useUITranslation();

    var navItems = [
        {
            key: 'live',
            label: translate('Live Settings')
        },
        {
            key: 'fields',
            label: translate('Field Editor')
        },
    ];

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
                    items={ navItems }
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
