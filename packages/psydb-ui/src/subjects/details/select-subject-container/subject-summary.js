import React from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';

import {
    findCRTAgeFrameField,
    calculateAge,
} from '@mpieva/psydb-common-lib';

import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';
import { datefns } from '@mpieva/psydb-ui-lib';


const SubjectSummary = (ps) => {
    var { record, crtSettings } = ps;
    
    var locale = useUILocale();
    var translate = useUITranslation();
    var ageField = findCRTAgeFrameField(crtSettings, { as: 'definition' });

    return (
        <div className='px-3 py-2 border bg-white mb-3'>
            <SplitPartitioned partitions={[ 1,1,1]}>
                <div>
                    <b>{ translate('Subject') }:</b>
                    {' '}
                    { record._recordLabel }
                </div>
                <div>
                    <b>{ ageField.displayName }:</b>
                    {' '}
                    { datefns.format(
                        new Date(jsonpointer.get(record, ageField.pointer)),
                        'P', { locale }
                    )}
                </div>
                <div>
                    <b>{ translate('Age Today') }:</b>
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
