import React from 'react';

import {
    useRouteMatch,
    useHistory,

    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

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
    var extra = reservationType === 'no-reservation' ? undefined : {
        [`${hashurl}/calendar`]: {
            label: translate('Appointments'),
            show: true, enabled: true
        },
        [`${hashurl}/reservation`]: {
            label: translate('Reservation'),
            show: true, enabled: true
        },
    }

    return (
        <div className='d-flex'>
            { (canBeReserved && reservationType !== 'no-reservation') && (
                <div
                    className='flex-shrink-0'
                    style={{ width: '175px' }}
                >
                    <Nav.Container className='bg-light border'>
                        <Nav.LinkList links={ core } />
                        { extra && (
                            <Nav.LinkList links={ extra } />
                        )}
                    </Nav.Container>
                </div>
            )}
            <div className='ml-2 flex-grow'>
                <Switch>
                    <Route exact path={`${path}`} render={ (ps) => (
                        <Redirect to={ `${url}/details` } />
                    )} />

                    <Route path={`${path}/details`}>
                        <RecordDetails
                            collection={ collection }
                            recordType={ recordType }
                        />
                    </Route>

                    <Route path={`${path}/edit`}>
                        <RecordEditor
                            type='edit'
                            collection={ collection }
                            recordType={ recordType }
                            onSuccessfulUpdate={ ({ id }) => {
                                history.push(`${url}`)
                            }}
                        />
                    </Route>

                    <Route path={`${path}/remove`}>
                        <RecordRemover
                            type='edit'
                            collection={ collection }
                            recordType={ recordType }
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
                                    locationId={ record._id }
                                    experimentTypes={[
                                        'inhouse', 'online-video-call'
                                    ]}
                                />
                            ) : (
                                <AwayTeamCalendar
                                    locationId={ record._id }
                                />
                            )}
                        </div>
                    </Route>

                    <Route path={`${path}/reservation`}>
                        <div className='border p-3'>
                            <ReservationCalendar
                                locationId={ record._id }
                                experimentTypes={[
                                    'inhouse', 'online-video-call'
                                ]}
                            />
                        </div>
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

const IntraRecordRouting = withRecordDetails({
    DetailsBody: IntraRecordRoutingBody,
    shouldFetchSchema: false,
})

export default IntraRecordRouting;
