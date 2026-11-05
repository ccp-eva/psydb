import React from 'react';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    FormBox,
    Fields as CoreFields,
    ExtendedSearchFields as Fields,
    withField,
    useFormikContext,
} from '@mpieva/psydb-ui-lib';

export const Filters = (ps) => {
    var { formData } = ps;
    var { subjectType } = formData?.specialFilters || {};
    var { setFieldValue } = useFormikContext();

    var { enabledLabMethods = [] } = useUIConfig();
    var [{ translate }] = useI18N();

    var boolOptions = translate.options({
        'any': 'Any',
        'only-true': 'Yes',
        'only-false': 'No',
    });

    return (
        <FormBox title={ translate('_extended_search_filters_tab') }>
            <SubjectTypeKey
                dataXPath='$.specialFilters.subjectType'
                label={ translate('Subject Type') }
                extraOnChange={ () => {
                    setFieldValue('$.specialFilters.subjectIds', []);
                    // NOTE: subject columns depend on the subject type
                    setFieldValue('$.columns', (formData?.columns || []).filter(
                        it => !it.startsWith('/_subject/')
                    ));
                }}
                helpText={ translate(
                    'Selecting a subject type enables the filter for specific subjects as well as additional subject columns.'
                )}
            />
            <Fields.ForeignIdList
                dataXPath='$.specialFilters.subjectIds'
                label={ translate('Subjects') }
                collection='subject'
                recordType={ subjectType }
                disabled={ !subjectType }
                labelClassName={ subjectType ? '' : 'text-muted opacity-50' }
                contentFallbackLabel={ translate('No Filter') }
            />
            <Fields.ForeignIdList
                dataXPath='$.specialFilters.studyIds'
                label={ translate('Studies') }
                collection='study'
                contentFallbackLabel={ translate('No Filter') }
            />
            <DateRange
                dataXPath='$.specialFilters.interval'
                label={ translate('Date Range') }
            />
            { enabledLabMethods.length > 1 && (
                <Fields.GenericMultiCheckbox
                    dataXPath='$.specialFilters.labMethods'
                    label={ translate('Lab Workflows') }
                    options={ enabledLabMethods.reduce((acc, key) => ({
                        ...acc, [key]: translate(`_labWorkflow_${key}`)
                    }), {}) }
                />
            )}
            <Fields.NegatableForeignIdList
                dataXPath='$.specialFilters.experimentOperatorIds'
                label={ translate('Experimenters') }
                collection='personnel'
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

const SubjectTypeKey = withField({ Control: (ps) => {
    var { helpText, ...pass } = ps;
    return (
        <>
            <CoreFields.SubjectTypeKey.Control { ...pass } />
            <small className='form-text text-muted'>
                { helpText }
            </small>
        </>
    )
}})

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
