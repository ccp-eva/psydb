import React from 'react';
import {
    Button,
} from '@mpieva/psydb-ui-layout';

import {
    FormBox,
    DefaultForm,
    ExtendedSearchFields as Fields
} from '@mpieva/psydb-ui-lib';

// TODO: filter undefined values from all id lists
export const Filters = (ps) => {
    var { crtSettings, schema } = ps;
    var { fieldDefinitions } = crtSettings;
    
    return (
        <FormBox title='Suchbedingungen'>
            <Fields.SaneString
                dataXPath='$.specialFilters.subjectId'
                label='ID'
            />
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
            <Fields.ForeignIdList
                dataXPath='$.specialFilters.didParticipateIn'
                label='Hat Teilgenommen an'
                collection='study'
            />
            <Fields.ForeignIdList
                dataXPath='$.specialFilters.didNotParticipateIn'
                label='Hat nicht Teilgenommen an'
                collection='study'
            />
            <Button type='submit'>
                Weiter
            </Button>
        </FormBox>
    )
}
