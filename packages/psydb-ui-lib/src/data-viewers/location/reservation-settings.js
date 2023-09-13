import React from 'react';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
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
    
    var translate = useUITranslation();
    var { Field } = useThemeContext();
    
    return (
        <>
            <Field label={ translate('Appointments Not on') }>
                <Weekdays value={ value.excludedExperimentWeekdays } />
            </Field>
        </>
    )
}

const Weekdays = (ps) => {
    var { value } = ps;
    
    var locale = useUILocale();
    
    return (
        Object.keys(value)
        .map((key, ix) => ({ key, ix }))
        .filter(it => !!value[it.key])
        .map(it => (
            locale.localize.day(it.ix + 1, { width: 'wide' })
        ))
        .join(', ')
    )
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
