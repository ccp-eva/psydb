import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { URL } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { DefaultRecordSideNav as Nav } from '@mpieva/psydb-ui-layout';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';

import {
    InviteCalendar,
    AwayTeamCalendar,
    ReservationCalendar
} from './calendars';

const IntraRecordRoutingBody = (ps) => {
    var {
        collection, recordType,
        fetched, permissions,

        RecordDetails, RecordEditor, RecordRemover
    } = ps;

    var [{ translate }] = useI18N();
    var history = useHistory();
    var { path, url } = useRouteMatch();

    var { record, crtSettings } = fetched;
    var { reservationType } = crtSettings;
    var { canBeReserved } = record.state.reservationSettings;

    //var enableEdit = permissions.hasCollectionFlag('location', 'write');
    var enableCalendar = permissions.hasSomeLabOperationFlags({
        types: 'any', flags: [ 'canViewExperimentCalendar' ]
    });
    var enableReservation = permissions.hasSomeLabOperationFlags({
        types: 'any', flags: [ 'canWriteReservations' ]
    });

    var { hashurl, core } = Nav.useLinks({ record });
    var extra = {
        [`${hashurl}/calendar`]: {
            label: translate('Appointments'),
            show: true, enabled: true
        },
        [`${hashurl}/reservation`]: {
            label: translate('Reservation'),
            show: true, enabled: true
        },
    }

    var showExtraNav = canBeReserved && reservationType !== 'no-reservation';
    var nav = (
        <div className='flex-shrink-0'>
            <Nav.Container className='bg-light border'>
                <Nav.LinkList links={ core } />
                { showExtraNav && (
                    <Nav.LinkList links={ extra } />
                )}
            </Nav.Container>
        </div>
    );

    var { _id: recordId, _recordLabel: recordLabel } = record;
    var sharedBag = { collection, recordType }

    var content = (
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

            <Route path={`${path}/remove`}>
                <RecordRemover
                    { ...sharedBag }
                    type='edit'
                    successInfoBackLink={ `#${URL.up(url, 1)}` }
                    onSuccessfulUpdate={ () => {
                        history.push(`${url}/remove/success`)
                    }}
                />
            </Route>
            
            <Route path={`${path}/calendar`}>
                <div className='border p-3'>
                    { canBeReserved ? (
                        <InviteCalendar
                            locationId={ recordId }
                            experimentTypes={[
                                'inhouse', 'online-video-call'
                            ]}
                        />
                    ) : (
                        <AwayTeamCalendar locationId={ recordId } />
                    )}
                </div>
            </Route>

            <Route path={`${path}/reservation`}>
                <div className='border p-3'>
                    <ReservationCalendar
                        locationId={ recordId }
                        experimentTypes={[ 'inhouse', 'online-video-call' ]}
                    />
                </div>
            </Route>
        </Switch>
    );

    return (
        <Wrapper
            title={ translate('Location') + ': ' + recordLabel }
            nav={ nav} content={ content }
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
            { nav ? (
                <div className='d-flex'>
                    <div className='flex-shrink-0'>
                        { nav }
                    </div>
                    <div className='ml-2 flex-grow'>
                        { content }
                    </div>
                </div>
            ) : (
                <div>{ content }</div>
            )}
        </>
    )
}

const IntraRecordRouting = withRecordDetails({
    DetailsBody: IntraRecordRoutingBody,
    shouldFetchSchema: false,
})

export default IntraRecordRouting;
