import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var {
        title,
        crtSettings,
        initialValues,
        onSubmit,

        related,
        permissions,

        renderFormBox = true,
    } = ps;

    var translate = useUITranslation();

    var renderedForm = (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
        >
            {(formikProps) => (
                <>
                    <FormFields
                        crtSettings={ crtSettings }
                        related={ related }
                        permissions={ permissions }
                    />
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    );

    return (
        renderFormBox
        ? (
            <FormBox title={ title }>
                { renderedForm }
            </FormBox>
        )
        : renderedForm
    );
}

const FormFields = (ps) => {
    var { crtSettings, related, permissions } = ps;
    var { fieldDefinitions } = crtSettings;
    
    var translate = useUITranslation();

    return (
        <>
            <Fields.SaneString
                label={ translate('_designation') }
                dataXPath='$.name'
                required
            />
            <Fields.SaneString
                label={ translate('Shorthand') }
                dataXPath='$.shorthand'
                required
            />
            <Fields.DateOnlyServerSide
                label={ translate('Start') }
                dataXPath='$.runningPeriod.start'
                required
            />
            <Fields.DateOnlyServerSide
                label={ translate('End') }
                dataXPath='$.runningPeriod.end'
            />
            <Fields.DefaultBool
                label={ translate('Subjects can be tested multiple times') }
                dataXPath='$.enableFollowUpExperiments'
            />
            <Fields.ForeignIdList
                label={ translate('Research Groups') }
                dataXPath='$.researchGroupIds'
                collection='researchGroup'
                required
            />
            <Fields.ForeignIdList
                label={ translate('Scientists') }
                dataXPath='$.scientistIds'
                collection='personnel'
                required
            />
            <Fields.ForeignIdList
                label={ translate('Study Topics') }
                dataXPath='$.studyTopicIds'
                collection='studyTopic'
            />

            <Fields.Custom
                fieldDefinitions={ fieldDefinitions }
                related={ related }
            />

            <Fields.AccessRightByResearchGroupList
                label={ translate('Record Access for') }
                dataXPath='$.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
            <Fields.DefaultBool
                label={ translate('Hidden') }
                dataXPath='$.systemPermissions.isHidden'
            />
        </>
    );
}
