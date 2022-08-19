import React from 'react';
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
    var permissions = usePermissions();
    
    return (
        <FormBox title='Suchbedingungen'>
            <Fields.Integer
                dataXPath='$.specialFilters.sequenceNumber'
                label='ID Nr.'
            />
            { permissions.isRoot() && (
                <Fields.SaneString
                    dataXPath='$.specialFilters.studyId'
                    label='Interne ID'
                />
            )}
            <Fields.SaneString
                dataXPath='$.specialFilters.name'
                label='Studienname'
            />
            <Fields.SaneString
                dataXPath='$.specialFilters.shorthand'
                label='Kürzel'
            />
            <Fields.NegatableForeignIdList
                dataXPath='$.specialFilters.researchGroupIds'
                label='Forschungsgruppen'
                collection='researchGroup'
            />
            <Fields.NegatableForeignIdList
                dataXPath='$.specialFilters.scientistIds'
                label='Wissenschaftler:innen'
                collection='personnel'
            />
            <Fields.NegatableForeignIdList
                dataXPath='$.specialFilters.studyTopicIds'
                label='Themengebiete'
                collection='studyTopic'
            />

            <Fields.Custom
                dataXPath='$.customFilters'
                fieldDefinitions={ fieldDefinitions }
            />

            <Button type='submit'>
                Weiter
            </Button>
        </FormBox>
    )
}
