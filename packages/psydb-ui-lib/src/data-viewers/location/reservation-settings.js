import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { FormattedDuration } from '@mpieva/psydb-common-lib/src/durations';
import { useThemeContext } from '../core/theme-context';

const ReservationSettings = (ps) => {
    var { value, related, crtSettings } = ps;
    var { reservationType } = crtSettings;

    switch (reservationType) {
        case 'inhouse':
            return <InhouseReservationSettings { ...ps} />
        case 'away-team':
            return <AwayTeamReservationSettings { ...ps } />
        default:
            return null
    }
}

const InhouseReservationSettings = (ps) => {
    var { value, related } = ps;
    
    var translate = useUITranslation();
    var { Field } = useThemeContext();

    return (
        <>
            <Field label={ translate('Weekdays') }>
                <Weekdays value={ value.possibleReservationWeekdays } />
            </Field>
            <Field label={ translate('Reservable From/To') }>
                <TimeOnlyInterval value={
                    value.possibleReservationTimeInterval
                } />
            </Field>
        </>
    )
}

const AwayTeamReservationSettings = (ps) => {
    var { value, related } = ps;
    var { Field } = useThemeContext();
    return (
        <>
            <Field label='Termine nicht am'>
                <Weekdays value={ value.excludedExperimentWeekdays } />
            </Field>
        </>
    )
}

const Weekdays = (ps) => {
    var { value } = ps;
    return (
        Object.keys(value)
        .filter(key => !!value[key])
        .map(key => weekdayMap[key])
        .join(', ')
    )
}

var weekdayMap = {
    'mon': 'Montag',
    'tue': 'Dienstag',
    'wed': 'Mittwoch',
    'thu': 'Donnerstag',
    'fri': 'Freitag',
    'sat': 'Samstag',
    'sun': 'Sonntag',
}

const TimeOnlyInterval = (ps) => {
    var { value } = ps;
    return (
        <>
            <TimeOnly value={ value.start } />
            {' - '}
            <TimeOnly value={ value.end } />
        </>
    )
}

const TimeOnly = (ps) => {
    var { value } = ps;
    return FormattedDuration(value, { resolution: 'MINUTE' });
}

export default ReservationSettings;
