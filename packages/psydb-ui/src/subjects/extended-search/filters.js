import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    FormBox,
    DefaultForm,
    ExtendedSearchFields as Fields
} from '@mpieva/psydb-ui-lib';

// TODO: filter undefined values from all id lists
export const Filters = (ps) => {
    var { crtSettings, schema } = ps;
    var { fieldDefinitions } = crtSettings;
    
    var translate = useUITranslation();
    var permissions = usePermissions();
    
    return (
        <FormBox title={ translate('_extended_search_filters_tab') }>
            <Fields.Integer
                dataXPath='$.specialFilters.sequenceNumber'
                label={ translate('ID No.') }
            />
            <Fields.SaneString
                dataXPath='$.specialFilters.onlineId'
                label={ translate('Online ID Code') }
            />
            { permissions.isRoot() && (
                <Fields.SaneString
                    dataXPath='$.specialFilters.subjectId'
                    label={ translate('Internal ID') }
                />
            )}
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
