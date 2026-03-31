import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { LinkButton, DefaultRecordSideNav as Nav }
    from '@mpieva/psydb-ui-layout';

import IsDirtyAlert from './is-dirty-alert';
import IsNewAlert from './is-new-alert';
import LiveDataEditor from './live-data-editor';
import FieldEditor from './field-editor';
import ImportSettings from './import-settings';
import RawView from './raw-view';

const IntraRecordRoutingBody = (ps) => {
    var {
        collection, recordType,
        fetched, permissions, revision,
        removeUrl,
    } = ps;
    
    var { record, related } = fetched;
    var { _id: recordId } = record;
    
    var history = useHistory();
    var { path, url } = useRouteMatch();
    
    var [{ translate }] = useI18N();
    var permissions = usePermissions();

    var { hashurl } = Nav.useLinks({ record });
    var core = {
        [`${hashurl}/live`]: {
            label: translate('Live Settings'),
            show: true,
        },
        [`${hashurl}/fields`]: {
            label: translate('Field Editor'),
            show: true,
        }
    }

    var extra = {}
    if (record.collection === 'subject') {
        /*extra[`${hashurl}/duplicate-settings`] = {
            label: translate('Duplicate Settings'),
            show: true,
        }*/
        extra[`${hashurl}/import-settings`] = {
            label: translate('Import Settings'),
            show: true,
        }
    }

    var admin = {};
    if (permissions.isRoot()) {
        admin[`${hashurl}/raw-view`] = {
            label: translate('Raw View'),
            show: true,
        }
    }

    var sharedBag = { collection, recordType };

    var nav = (
        <Nav.Container className='bg-light border'>
            <Nav.LinkList links={ core } />
            { Object.keys(extra).length > 0 && (
                <>
                    <Nav.HR />
                    <Nav.LinkList links={ extra } />
                </>
            )}
            { Object.keys(admin).length > 0 && (
                <>
                    <Nav.HR />
                    <Nav.LinkList links={ admin } />
                </>
            )}
        </Nav.Container>
    );
   
    var content = (
        <>
            <RecordInfo fetched={ fetched } />
            <hr />
            <Switch>
                <Route exact path={`${path}`} render={ (ps) => (
                    <Redirect to={ `${url}/live` } />
                )} />

                <Route path={`${path}/live`}>
                    <LiveDataEditor
                        record={ record }
                        onSuccessfulUpdate={ revision.up }
                    />
                </Route>
                
                <Route path={`${path}/fields`}>
                    <FieldEditor
                        record={ record }
                        onSuccessfulUpdate={ revision.up }
                    />
                </Route>
                { record.collection === 'subject' && (
                    <Route path={`${path}/import-settings`}>
                        <ImportSettings
                            record={ record }
                            onSuccessfulUpdate={ revision.up }
                        />
                    </Route>
                )}
                { permissions.isRoot() && (
                    <Route path={`${path}/raw-view`}>
                        <RawView record={ record } />
                    </Route>
                )}
            </Switch>
            
            <hr />

            <LinkButton variant='danger' to={ `${hashurl}/remove` }>
                { translate('Delete') }
            </LinkButton>
        </>
    );

    return (
        <Wrapper
            title={ translate('Record Type') + ': ' + record._recordLabel }
            nav={ nav } content={ content }
        />
    )
}

var RecordInfo = (ps) => {
    var { fetched } = ps;
    var { record } = fetched;
    var { collection, type, state } = record;
    var { isNew, isDirty } = state;
    
    var [{ translate }] = useI18N();

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
        </>
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

const IntraRecordRouting = withRecordDetails({
    DetailsBody: IntraRecordRoutingBody,
    shouldFetchSchema: false,
    shouldFetchCRTSettings: false,
})

export default IntraRecordRouting;
