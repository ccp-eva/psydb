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
