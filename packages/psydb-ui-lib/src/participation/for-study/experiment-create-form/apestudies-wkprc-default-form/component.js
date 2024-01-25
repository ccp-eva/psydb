import React from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';
import { CRTSettings, SmartArray } from '@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useFetchChain } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../form-fields/fields';

import {
    withSubjectTypeSelect,
    Footer,

    SubjectsAreTestedTogetherField,
    //SplitExpSubjectFields,
    GroupExpSubjectFields
} from '../shared';

import useCustomFetchChain from './use-custom-fetch-chain';
import SplitExpSubjectFields from './wkprc-split-exp-subject-fields';

export const Component = withSubjectTypeSelect((ps) => {
    var {
        labMethodSettings,
        subjectType,
        related,
        
        studyId,
        enableTeamSelect,
        preselectedSubject,
        initialValues,
        ...pass
    } = ps;

    var [ didFetch, fetched ] = useCustomFetchChain(ps);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    console.log({ fetched });

    var {
        subjectGroupFieldDef,
        subjectGroup,
        location
    } = fetched._stageDatas;

    var formBodyBag = {
        labMethodSettings,
        subjectType,
        related,

        subjectGroupFieldDef,
        subjectGroup,
        location,
        preselectedSubject,
    };

    initialValues = {
        ...initialValues,
        ...(subjectGroup?.record && {
            subjectGroupId: subjectGroup.record._id
        }),
        ...(location?.record && {
            locationId: location.record._id
        })
    }

    return (
        <DefaultForm { ...pass } initialValues={ initialValues }>
            {(formikProps) => (
                <>
                    <FormBody { ...formBodyBag } formik={ formikProps } />
                </>
            )}
        </DefaultForm>
    );
})

const FormBody = (ps) => {
    var {
        formik,
        labMethodSettings,
        subjectType,
        subjectCRTSettings,
        related,
        subjectGroupFieldDef,
        preselectedSubject,
    } = ps;

    var translate = useUITranslation();

    var { values } = formik;
    var {
        locationId,
        subjectGroupId,
        subjectsAreTestedTogether,
        subjectData
    } = values['$'];
    
    var subjectConstraints = {
        [subjectGroupFieldDef.pointer]: subjectGroupId
    }

    var hasSelectedSubjects = !!subjectData.find(it => !!it.subjectId);

    return (
        <>
            <Fields.ApestudiesWKPRCDefaultLocation
                labMethodSettings={ labMethodSettings }
                related={ related }
                disabled={ hasSelectedSubjects }
                readOnly={ !!preselectedSubject }
                required={ !preselectedSubject }
            />
            <Fields.ForeignId
                label={ translate('Group') }
                dataXPath='$.subjectGroupId'
                collection='subjectGroup'
                constraints={{
                    '/subjectType': subjectType || '',
                    '/state/locationId': locationId || ''
                }}
                readOnly={ !!preselectedSubject }
                disabled={ !locationId || hasSelectedSubjects }
                required={ !preselectedSubject }
            />

            { subjectGroupId && (
                <>
                    {/*<SubjectsAreTestedTogetherField />*/}

                    <BranchFields
                        { ...ps }
                        subjectConstraints={ subjectConstraints }
                    />
                    
                    <Fields.SaneString
                        label={ translate('_wkprc_experimentName') }
                        dataXPath='$.experimentName'
                        required
                    />
                    <Fields.GenericEnum
                        label={ translate('_wkprc_roomOrEnclosure') }
                        dataXPath='$.roomOrEnclosure'
                        required
                        options={{
                            'Sleeping Room': 'Sleeping Room',
                            'Observation Room': 'Observation Room',
                            'Outdoor Enclosure': 'Outdoor Enclosure',
                            'Indoor Enclosure': 'Indoor Enclosure',
                        }}
                    />

                    <Fields.ExperimentOperators />
                    
                    <Footer />
                </>
            )}
        </>
    );
}

const BranchFields = (ps) => {
    var {
        preselectedSubject = undefined,
        subjectsAreTestedTogether,

        subjectType,
        subjectConstraints
    } = ps;

    var translate = useUITranslation();

    if (preselectedSubject) {
        return (
            <>
                <Fields.ForeignId
                    label={ translate('Subject') }
                    dataXPath='$.subjectData.0.subjectId'
                    collection='subject'
                    recordType={ subjectType }
                    //constraints={ subjectConstraints }
                    readOnly={ true }
                />
                <Fields.DateOnlyTimestamp required />
            </>
        )
    }
    else if (subjectsAreTestedTogether) {
        return (
            <>
                <GroupExpSubjectFields
                    label={ translate('Subjects') }
                    dataXPath='$.subjectData'
                    subjectType={ subjectType }
                    subjectConstraints={ subjectConstraints }
                    enableMove={ false }
                />
                <Fields.DateOnlyTimestamp required />
            </>
        )
    }
    else {
        return (
            <SplitExpSubjectFields
                label={ translate('Subjects') }
                dataXPath='$.subjectData'
                subjectType={ subjectType }
                subjectConstraints={ subjectConstraints }
                enableMove={ false }
                required
            />
        )
    }

}
