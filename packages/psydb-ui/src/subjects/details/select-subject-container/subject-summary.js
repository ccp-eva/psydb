import React from 'react';
import jsonpointer from 'jsonpointer';

import {
    findCRTAgeFrameField,
    calculateAge,
} from '@mpieva/psydb-common-lib';

import { SplitPartitioned } from '@mpieva/psydb-ui-layout';
import { datefns } from '@mpieva/psydb-ui-lib';


const SubjectSummary = (ps) => {
    var { record, crtSettings } = ps;
    var ageField = findCRTAgeFrameField(crtSettings, { as: 'definition' });

    return (
        <div className='px-3 py-2 border bg-white mb-3'>
            <SplitPartitioned partitions={[ 1,1,1]}>
                <div>
                    <b>Proband:in:</b> { record._recordLabel }
                </div>
                <div>
                    <b>{ ageField.displayName }:</b>
                    {' '}
                    { datefns.format(
                        new Date(jsonpointer.get(record, ageField.pointer)),
                        'dd.MM.yyyy'
                    )}
                </div>
                <div>
                    <b>Alter heute:</b>
                    {' '}
                    { calculateAge({
                        base: jsonpointer.get(record, ageField.pointer),
                        relativeTo: new Date()
                    })}
                </div>
            </SplitPartitioned>
        </div>
    )
}

export default SubjectSummary;
