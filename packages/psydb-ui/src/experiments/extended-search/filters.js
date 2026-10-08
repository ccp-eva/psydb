import React from 'react';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    FormBox,
    Fields as CoreFields,
    ExtendedSearchFields as Fields,
    withField
} from '@mpieva/psydb-ui-lib';

export const Filters = (ps) => {
    var { enabledLabMethods = [] } = useUIConfig();
    var [{ translate }] = useI18N();

    var boolOptions = translate.options({
        'any': 'Any',
        'only-true': 'Yes',
        'only-false': 'No',
    });

    return (
        <FormBox title={ translate('_extended_search_filters_tab') }>
            { enabledLabMethods.length > 1 && (
                <Fields.GenericMultiCheckbox
                    dataXPath='$.specialFilters.labMethods'
                    label={ translate('Lab Workflows') }
                    options={ enabledLabMethods.reduce((acc, key) => ({
                        ...acc, [key]: translate(`_labWorkflow_${key}`)
                    }), {}) }
                />
            )}
            <DateRange
                dataXPath='$.specialFilters.interval'
                label={ translate('Date Range') }
            />
            <Fields.NegatableForeignIdList
                dataXPath='$.specialFilters.studyIds'
                label={ translate('Studies') }
                collection='study'
            />
            <Fields.NegatableForeignIdList
                dataXPath='$.specialFilters.experimentOperatorIds'
                label={ translate('Experimenters') }
                collection='personnel'
            />
            <Fields.GenericRadioGroup
                dataXPath='$.specialFilters.isCanceled'
                label={ translate('Canceled') }
                options={ boolOptions }
            />
            <Fields.GenericRadioGroup
                dataXPath='$.specialFilters.isPostprocessed'
                label={ translate('Postprocessed') }
                options={ boolOptions }
            />

            <Button type='submit'>
                { translate('Next') }
            </Button>
        </FormBox>
    )
}

const DateRange = withField({ Control: (ps) => {
    var { dataXPath } = ps;

    var [{ translate }] = useI18N();
    return (
        <div className='d-flex border p-3'>
            <div className='w-50 flex-grow'>
                <CoreFields.DateOnlyServerSide
                    dataXPath={ `${dataXPath}.start` }
                    label={ translate('_range_from') }
                    formGroupClassName='mb-0'
                />
            </div>
            <div className='w-50 flex-grow'>
                <CoreFields.DateOnlyServerSide
                    dataXPath={ `${dataXPath}.end` }
                    label={ translate('_range_to') }
                    formGroupClassName='mb-0'
                />
            </div>
        </div>
    )
}})
