import React from 'react';
import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';
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

    var {
        showOnlineId,
        showSequenceNumber,
        requiresTestingPermissions,
    } = crtSettings;
    
    var [{ translate }] = useI18N();
    var { isRoot } = usePermissions();
    var { dev_enableSubjectDuplicatesSearch = false } = useUIConfig();
    
    return (
        <FormBox title={ translate('_extended_search_filters_tab') }>
            <Grid cols={[ '1fr', '1fr' ]}>
                { showSequenceNumber && (
                    <Fields.SaneString
                        dataXPath='$.specialFilters.sequenceNumber'
                        label={ translate('ID No.') }
                        uiSplit={[ 4,8 ]}
                    />
                )}
                { showSequenceNumber && dev_enableSubjectDuplicatesSearch && (
                    <Fields.SaneString
                        dataXPath='$.specialFilters.mergedDuplicateSequenceNumber'
                        label={ translate('ID No. (from Duplicate)') }
                        uiSplit={[ 4,8 ]}
                    />
                )}
                { showOnlineId && (
                    <Fields.SaneString
                        dataXPath='$.specialFilters.onlineId'
                        label={ translate('Online ID Code') }
                        uiSplit={[ 4,8 ]}
                    />
                )}
                { showOnlineId && dev_enableSubjectDuplicatesSearch && (
                    <Fields.SaneString
                        dataXPath='$.specialFilters.mergedDuplicateOnlineId'
                        label={ translate('Online ID Code (from Duplicate)') }
                        uiSplit={[ 4,8 ]}
                    />
                )}
                { isRoot() && (
                    <Fields.SaneString
                        dataXPath='$.specialFilters.subjectId'
                        label={ translate('Internal ID') }
                        uiSplit={[ 4,8 ]}
                    />
                )}
                { isRoot() && dev_enableSubjectDuplicatesSearch && (
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
            { requiresTestingPermissions && (
                <Fields.HasTestingPermission
                    dataXPath='$.specialFilters.hasTestingPermission'
                    label={ translate('Has Participation Permission')  }
                />
            )}
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
