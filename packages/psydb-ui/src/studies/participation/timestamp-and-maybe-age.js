import React from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';
import { calculateAge } from '@mpieva/psydb-common-lib';
import { check1970 } from '@mpieva/psydb-ui-utils';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { datefns } from '@mpieva/psydb-ui-lib';

// FIXME: dup
const TimestampAndMaybeAge = (ps) => {
    var { record, timestamp, testingAge, dateOfBirthField } = ps;
    
    var { dev_enableWKPRCPatches: IS_WKPRC } = useUIConfig();
    var [{ translate, fdate }] = useI18N();
    
    if (check1970(timestamp)) {
        return (
            <>
                <td>-</td>
                { dateOfBirthField && <td>-</td> }
            </>
        )
    }
    else {
        var formattedTS = fdate(timestamp, IS_WKPRC ? 'P' : 'P p');

        var out = [
            <td key='ts'>{ formattedTS }</td>
        ];
        if (dateOfBirthField) {
            var { pointer } = dateOfBirthField;
            var dob = jsonpointer.get(record, pointer);

            var age = undefined;
            if (dob) {
                age = calculateAge({ base: dob, relativeTo: timestamp });
            }
            else if (testingAge) {
                var { years, months, days } = testingAge;
                age = `${years}/${months}/${days}`
            }
            else {
                age = translate('Unknown');
            }

            out.push(
                <td key='age'>{ age }</td>
            );
        }

        return out;
    }
}

export default TimestampAndMaybeAge;
