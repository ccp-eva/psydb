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
                    dataXPath='$.specialFilters.locationId'
                    label='Interne ID'
                />
            )}

            <Fields.Custom
                dataXPath='$.customFilters'
                fieldDefinitions={ fieldDefinitions }
            />

            <Fields.GenericRadioGroup
                dataXPath='$.specialFilters.isHidden'
                label='Ausgeblendete'
                options={{
                    'any': 'Alle Anzeigen',
                    'only-false': 'Nicht Anzeigen',
                    'only-true': 'Nur Ausgeblendete Anzeigen'
                }}
            />

            <Button type='submit'>
                Weiter
            </Button>
        </FormBox>
    )
}
