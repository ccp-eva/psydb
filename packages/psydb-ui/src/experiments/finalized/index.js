import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

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

    var translate = useUITranslation();

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
