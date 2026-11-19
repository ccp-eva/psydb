import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import GeneralInfo from '../general-info';
import AllSubjects from './all-subjects';

const ExperimentFinalized = (ps) => {
    var {
        experimentData,
        labProcedureSettingData,
        opsTeamData,
        locationData,
        studyData,
        subjectDataByType,

        onSuccessfulUpdate,
    } = ps;

    var [{ translate }] = useI18N();

    return (
        <div>
            <div className='border bg-light p-3'>
                <h5 className='text-success'>
                    { translate('Completed') }
                </h5>
                <GeneralInfo { ...({
                    experimentData,
                    opsTeamData,
                    locationData,
                    studyData,
                    onSuccessfulUpdate,
                }) } />
            </div>
            <div>
                <AllSubjects { ...({
                    experimentData,
                    labProcedureSettingData,
                    studyData,
                    subjectDataByType,
                }) } />
            </div>
        </div>

    );
}

export default ExperimentFinalized;
