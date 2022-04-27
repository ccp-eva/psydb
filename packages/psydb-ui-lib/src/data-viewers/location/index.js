import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    Custom,
    SaneString,
    SystemPermissions,
} from '../utility-components';

import ReservationSettings from './reservation-settings';

const labels = {
    '/sequenceNumber': 'ID Nr.',
    '/state/systemPermissions': 'Zugriff auf diesen Datensatz für'
}

const [ Location, LocationContext ] = createBase();
addComponents(Location, LocationContext, labels, [
    {
        cname: 'SequenceNumber',
        path: '/sequenceNumber',
        Component: withPair(SaneString)
    },
    {
        cname: 'SystemPermissions',
        path: '/state/systemPermissions',
        Component: withPair(SystemPermissions)
    },
    {
        cname: 'ReservationSettings',
        path: '/state/reservationSettings',
        Component: ReservationSettings
    },

    { cname: 'Custom', path: '/state/custom', Component: Custom },
]);

export default Location;
