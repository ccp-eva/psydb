import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button, Grid } from '@mpieva/psydb-ui-layout';
import {
    FormBox,
    DefaultForm,
    Fields as CoreFields,
    ExtendedSearchFields as Fields,

    withField
} from '@mpieva/psydb-ui-lib';

// TODO: filter undefined values from all id lists
export const Filters = (ps) => {
    var { crtSettings, schema } = ps;
    var { fieldDefinitions } = crtSettings;
    
    var translate = useUITranslation();
    var permissions = usePermissions();
    
    return (
        <FormBox title={ translate('_extended_search_filters_tab') }>
            <Grid cols={[ '1fr', '1fr' ]}>
                <Fields.SaneString
                    dataXPath='$.specialFilters.sequenceNumber'
                    label={ translate('ID No.') }
                    uiSplit={[ 4,8 ]}
                />
                <Fields.SaneString
                    dataXPath='$.specialFilters.mergedDuplicateSequenceNumber'
                    label={ translate('ID No. (from Duplicate)') }
                    uiSplit={[ 4,8 ]}
                />
                <Fields.SaneString
                    dataXPath='$.specialFilters.onlineId'
                    label={ translate('Online ID Code') }
                    uiSplit={[ 4,8 ]}
                />
                <Fields.SaneString
                    dataXPath='$.specialFilters.mergedDuplicateOnlineId'
                    label={ translate('Online ID Code (from Duplicate)') }
                    uiSplit={[ 4,8 ]}
                />
                { permissions.isRoot() && (
                    <Fields.SaneString
                        dataXPath='$.specialFilters.subjectId'
                        label={ translate('Internal ID') }
                        uiSplit={[ 4,8 ]}
                    />
                )}
                { permissions.isRoot() && (
                    <Fields.SaneString
                        dataXPath='$.specialFilters.mergedDuplicateId'
                        label={ translate('Internal ID (from Duplicate)') }
                        uiSplit={[ 4,8 ]}
                    />
                )}
            </Grid>

            <Fields.Custom
                dataXPath='$.customGdprFilters'
                subChannelKey='gdpr'
                fieldDefinitions={ fieldDefinitions }
            />
            <Fields.Custom
                dataXPath='$.customScientificFilters'
                subChannelKey='scientific'
                fieldDefinitions={ fieldDefinitions }
            />
            <Fields.HasTestingPermission
                dataXPath='$.specialFilters.hasTestingPermission'
                label={ translate('Has Participation Permission')  }
            />
            <Fields.ForeignIdList
                dataXPath='$.specialFilters.didParticipateIn'
                label={ translate('Has Participated in') }
                collection='study'
            />
            <Fields.ForeignIdList
                dataXPath='$.specialFilters.didNotParticipateIn'
                label={ translate('Has Not Participated in') }
                collection='study'
            />

            {/* XXX */}
            <ParticipatedBetween
                dataXPath='$.specialFilters.participationInterval'
                label={ translate('Participated') }
            />

            {(
                !crtSettings.commentFieldIsSensitive
                || permissions.hasFlag('canAccessSensitiveFields')
            ) && (
                <Fields.FullText
                    dataXPath='$.specialFilters.comment'
                    label={ translate('Comment') }
                />
            )}

            <Fields.GenericRadioGroup
                dataXPath='$.specialFilters.isHidden'
                label={ translate('Hidden Records') }
                options={translate.options({
                    'any': '_isHidden_any',
                    'only-false': '_isHidden_only-false',
                    'only-true': '_isHidden_only-true'
                })}
            />

            <Button type='submit'>
                { translate('Next') }
            </Button>
        </FormBox>
    )
}

const ParticipatedBetween = withField({ Control: (ps) => {
    var { dataXPath } = ps;

    var translate = useUITranslation();
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
