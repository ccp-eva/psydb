import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../../form-fields';

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
    var { initialValues } = ps;

    var formBag = only({ from: ps, keys: [
        'useAjvAsync',
        'ajvErrorInstancePathPrefix',
        'onSubmit',
    ]});

    var formBodyBag = only({ from: ps, keys: [
        'isTransmitting',
        'labMethodSettings',
        'subjectType',
        'related',
        'preselectedSubject',
    ]});

    var [ didFetch, fetched ] = useCustomFetchChain(ps);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        subjectGroupFieldDef,
        subjectGroup,
        location
    } = fetched._stageDatas;

    initialValues = withExtraInitialValues(initialValues, {
        subjectGroup, location
    });

    return (
        <DefaultForm { ...formBag } initialValues={ initialValues }>
            {(formikProps) => (
                <>
                    <FormBody
                        { ...formBodyBag }
                        subjectGroupFieldDef={ subjectGroupFieldDef }
                        formik={ formikProps }
                    />
                </>
            )}
        </DefaultForm>
    );
})

const FormBody = (ps) => {
    var {
        isTransmitting,
        formik,
        labMethodSettings,
        subjectType,
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
                    
                    <Footer isTransmitting={ isTransmitting } />
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
                    { ...getMultiSubjectsBag(ps) }
                />
                <Fields.DateOnlyTimestamp required />
            </>
        )
    }
    else {
        return (
            <SplitExpSubjectFields
                label={ translate('Subjects') }
                { ...getMultiSubjectsBag(ps) }
            />
        )
    }

}

var withExtraInitialValues = (initialValues, bag) => {
    var { subjectGroup, location } = bag;
    return {
        ...initialValues,
        ...(subjectGroup?.record && {
            subjectGroupId: subjectGroup.record._id
        }),
        ...(location?.record && {
            locationId: location.record._id
        })
    }
}

var getMultiSubjectsBag = (ps) => {
    var { subjectType, subjectConstraints, preselectedSubject } = ps;
    return {
        dataXPath: '$.subjectData',
        subjectType,
        enableMove: false,
        fixedIndexes: preselectedSubject ? [ 0 ] : [],
        required: true
    }
}
