import React from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';
import { calculateAge } from '@mpieva/psydb-common-lib';
import { check1970 } from '@mpieva/psydb-ui-utils';
import { useUIConfig, useUILocale } from '@mpieva/psydb-ui-contexts';

import datefns from '../date-fns';

const TimestampAndMaybeAge = (ps) => {
    var { record, timestamp, dateOfBirthField } = ps;
    
    var { dev_enableWKPRCPatches: IS_WKPRC } = useUIConfig();
    var locale = useUILocale();

    if (check1970(timestamp)) {
        return (
            <>
                <td>-</td>
                { dateOfBirthField && <td>-</td> }
            </>
        )
    }
    else {
        var formattedTS = datefns.format(
            new Date(timestamp), (IS_WKPRC ? 'P' : 'P p'), { locale }
        );

        var out = [
            <td key='ts'>{ formattedTS }</td>
        ];
        if (dateOfBirthField) {
            var { pointer } = dateOfBirthField;
            var dob = jsonpointer.get(record, pointer);
            var age = calculateAge({ base: dob, relativeTo: timestamp });

            out.push(
                <td key='age'>{ age }</td>
            );
        }

        return out;
    }
}

export default TimestampAndMaybeAge;
