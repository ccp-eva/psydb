import React from 'react';
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
                    <Button type='submit'>Speichern</Button>
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
    
    return (
        <>
            <Fields.SaneString
                label='Bezeichnung'
                dataXPath='$.name'
            />
            <Fields.SaneString
                label='Kürzel'
                dataXPath='$.shorthand'
            />
            <Fields.DateOnlyServerSide
                label='Beginn'
                dataXPath='$.runningPeriod.start'
            />
            <Fields.DateOnlyServerSide
                label='Ende'
                dataXPath='$.runningPeriod.end'
            />
            <Fields.DefaultBool
                label='Proband:innen können mehrfach getestet werden'
                dataXPath='$.enableFollowUpExperiments'
            />
            <Fields.ForeignIdList
                label='Forschungsgruppen'
                dataXPath='$.researchGroupIds'
                collection='researchGroup'
            />
            <Fields.ForeignIdList
                label='Wissenschaftler'
                dataXPath='$.scientistIds'
                collection='personnel'
            />
            <Fields.ForeignIdList
                label='Themengebiete'
                dataXPath='$.studyTopicIds'
                collection='studyTopic'
            />

            <Fields.Custom
                fieldDefinitions={ fieldDefinitions }
                related={ related }
            />

            <Fields.AccessRightByResearchGroupList
                label='Zugriff auf diesen Datensatz für'
                dataXPath='$.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
        </>
    );
}
