import React from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams,

    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { RoutedSideNav } from '@mpieva/psydb-ui-layout';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import {
    InviteCalendar,
    AwayTeamCalendar,
    ReservationCalendar
} from './calendars';

const IntraRecordRoutingBody = (ps) => {
    var {
        collection,
        recordType,
        fetched,
        permissions,
        //revision,

        RecordDetails,
        RecordCreator,
        RecordEditor,
        RecordRemover,
    } = ps;

    var translate = useUITranslation();
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

    var navItems = [
        {
            key: 'details',
            label: translate('Details')
        },
        //{
        //    key: 'edit',
        //    label: 'Beabeiten',
        //    disabled: !enableEdit,
        //},
        ...(reservationType !== 'no-reservation' ? ([
            {
                key: 'calendar',
                label: translate('Appointments')
            },
            {
                key: 'reservation',
                label: translate('Reservation'),
                show: canBeReserved
            }
        ]) : [])
    ];

    return (
        <div className='d-flex'>
            { (canBeReserved && reservationType !== 'no-reservation') && (
                <div
                    className='flex-shrink-0'
                    style={{ width: '175px' }}
                >
                    <Route path={ `${path}/:navKey`}>
                        <RoutedSideNav
                            className='bg-light border'
                            param='navKey'
                            items={ navItems }
                            remap={{ edit: 'details', remove: 'details' }}
                        />
                    </Route>
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
                            successInfoBackLink={ `#${up(url, 1)}` }
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
