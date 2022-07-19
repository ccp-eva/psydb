import React from 'react';
import jsonpointer from 'jsonpointer';

import {
    findCRTAgeFrameField,
    calculateAge,
} from '@mpieva/psydb-common-lib';

import { datefns } from '@mpieva/psydb-ui-lib';


const SubjectSummary = (ps) => {
    var { record, crtSettings } = ps;
    var ageField = findCRTAgeFrameField(crtSettings, { as: 'definition' });

    return (
        <div>
            <b>Proband:in:</b> { record._recordLabel }
            {' '}
            <b>{ ageField.displayName }:</b>
            {' '}
            { datefns.format(
                new Date(jsonpointer.get(record, ageField.pointer)),
                'dd.MM.yyyy'
            )}
            {' '}
            <b>Alter:</b>
            {' '}
            { calculateAge({
                base: jsonpointer.get(record, ageField.pointer),
                relativeTo: new Date()
            })}
        </div>
    )
}

export default SubjectSummary;
