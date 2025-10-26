import React from 'react';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    FormBox,
    ExtendedSearchFields as Fields
} from '@mpieva/psydb-ui-lib';

// TODO: filter undefined values from all id lists
export const Filters = (ps) => {
    var { crtSettings, schema } = ps;
    var { fieldDefinitions } = crtSettings;
    
    var { dev_enableWKPRCPatches: IS_WKPRC } = useUIConfig();
    var [{ translate }] = useI18N();
    var permissions = usePermissions();
    
    return (
        <FormBox title={ translate('_extended_search_filters_tab') }>
            <Fields.SaneString
                dataXPath='$.specialFilters.sequenceNumber'
                label={ translate('ID No.') }
            />
            { permissions.isRoot() && (
                <Fields.SaneString
                    dataXPath='$.specialFilters.studyId'
                    label={ translate('Internal ID') }
                />
            )}
            <Fields.SaneString
                dataXPath='$.specialFilters.name'
                label={ translate('Name') }
            />
            { !IS_WKPRC && (
                <Fields.SaneString
                    dataXPath='$.specialFilters.shorthand'
                    label={ translate('Shorthand') }
                />
            )}
            <Fields.NegatableForeignIdList
                dataXPath='$.specialFilters.researchGroupIds'
                label={ translate('Research Groups') }
                collection='researchGroup'
            />
            <Fields.NegatableForeignIdList
                dataXPath='$.specialFilters.scientistIds'
                label={ translate('Scientists') }
                collection='personnel'
            />
            <Fields.NegatableForeignIdList
                dataXPath='$.specialFilters.studyTopicIds'
                label={ translate('Study Topics') }
                collection='studyTopic'
            />
            { IS_WKPRC && (
                <Fields.SaneString
                    dataXPath='$.specialFilters.experimentNames'
                    label={ translate('_wkprc_experimentName') }
                />
            )}

            <Fields.Custom
                dataXPath='$.customFilters'
                fieldDefinitions={ fieldDefinitions }
            />

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
