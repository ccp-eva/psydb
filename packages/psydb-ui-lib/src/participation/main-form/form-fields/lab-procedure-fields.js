import React, { useState } from 'react';
import jsonpointer from 'jsonpointer';

import { keyBy } from '@mpieva/psydb-core-utils';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useFetch, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    Fields,
} from '../../../formik';

import { InviteFields } from './invite-fields';
import { AwayTeamFields } from './away-team-fields';

export const LabProcedureFields = (ps) => {
    var {
        subjectType,
        subjectId,
        studyId,

        formikForm
    } = ps;

    var { labProcedureType } = formikForm.values['$'];

    var [ didFetch, fetched ] = useFetch((agent) => (
        studyId && subjectType
        ? agent.fetchExperimentVariantSettings({
            studyId, subjectType
        })
        : undefined
    ),
        [ studyId, subjectType ]
        /*{
        extraEffect: () => {
            // TODO: set field if its only 1 option
        },
        dependencies: [ studyId ]
    }*/
    );

    if (!didFetch || !fetched.data) {
        return <TypeSelect types={[]} disabled />
    }

    var { records, related } = fixRelated(fetched.data);

    var settingsByType = keyBy({ items: records, byProp: 'type' });
    var types = Object.keys(settingsByType);

    return (
        <>
            <TypeSelect types={ types } disabled={ !subjectId } />
            { labProcedureType && (
                <TypeFields
                    settings={ settingsByType[labProcedureType] }
                    related={ related }
                    
                    subjectId={ subjectId }
                    subjectType={ subjectType }
                    formikForm={ formikForm }
                />
            )}
        </>
    )
}

const TypeSelect = (ps) => {
    var { types, disabled } = ps;
    return (
        <Fields.GenericEnum
            label='Ablauf-Typ'
            dataXPath='$.labProcedureType'
            options={ types.reduce((acc, it) => ({
                ...acc, [it]: enums.experimentVariants.getLabel(it)
            }), {}) }
            disabled={ disabled }
        />
    )
}

const TypeFields = (ps) => {
    var { type } = ps.settings;

    if (['inhouse', 'online-video-call'].includes(type)) {
        return (
            <InviteFields { ...ps } />
        )
    }
    if (['away-team'].includes(type)) {
        return (
            <AwayTeamFields { ...ps } />
        );
    }
    else {
        return null;
    }
}
