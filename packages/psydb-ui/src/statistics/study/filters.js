import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { FormBox, DefaultForm } from '@mpieva/psydb-ui-lib';
import Fields from '../formik-fields';

const StudyStatisticsFilters = () => {
    var translate = useUITranslation();

    return (
        <FormBox title={ translate('_extended_search_filters_tab') }>
            <Fields.DateOnlyServerSideInterval
                dataXPath='$.runningPeriodOverlap'
                label={ translate('Date Range') }
            />
            <Fields.LabMethodKey
                dataXPath='$.labMethod'
                label={ translate('Lab Workflow') }
            />
            <Fields.ForeignId
                dataXPath='$.researchGroupId'
                collection='researchGroup'
                label={ translate('Research Group') }
            />
            <Fields.ForeignId
                dataXPath='$.scientistId'
                collection='personnel'
                label={ translate('Scientist') }
            />
            <Fields.AgeFrameInterval
                dataXPath='$.ageFrameIntervalOverlap'
                label={ translate('Age Range') }
            />
        </FormBox>
    )
}

export default StudyStatisticsFilters;
