import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../form-fields/fields';

import {
    GroupExpSubjectFields,
    Footer,
} from '../shared';

export const Component = (ps) => {
    var {
        subjectType,
        experiment,
        study,
        labMethodSettings,
        related,
        
        ...pass
    } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCRTSettings({
            collection: 'subject',
            recordType: subjectType
        })
    ), [ subjectType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var subjectCRTSettings = CRTSettings({ data: fetched.data });

    var initialValues = {
        ...only({ from: experiment.state, paths: [
            'locationId',
            'subjectGroupId',
            'experimentName',
            'roomOrEnclosure',
        ]}),
        timestamp: experiment.state.interval.start,
        subjectData: [{
            ...only({
                from: experiment.state.subjectData[0],
                paths: [ 'subjectId', 'comment' ],
            }),
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false
        }],
        labOperatorIds: experiment.state.experimentOperatorIds,
    }

    var formBodyBag = {
        labMethodSettings,
        subjectType,
        subjectCRTSettings,
        related,
    }

    return (
        <DefaultForm initialValues={ initialValues } { ...pass }>
            {(formikProps) => (
                <>
                    <FormBody { ...formBodyBag } formik={ formikProps } />
                </>
            )}
        </DefaultForm>
    );
}

const FormBody = (ps) => {
    var {
        formik,
        labMethodSettings,
        subjectType,
        subjectCRTSettings,
        related
    } = ps;

    var translate = useUITranslation();

    var { values } = formik;
    var {
        locationId,
        subjectGroupId,
        subjectsAreTestedTogether,
        subjectData
    } = values['$'];
    
    var subjectGroupFields = subjectCRTSettings.findCustomFields({
        'type': 'ForeignId',
        'props.collection': 'subjectGroup'
    });

    // FIXME: we cant support multiple group fields currently
    var subjectGroupConstraintField = subjectGroupFields[0];
    var subjectConstraints = {
        [subjectGroupConstraintField.pointer]: subjectGroupId
    }

    var hasSelectedSubjects = !!subjectData.find(it => !!it.subjectId);

    return (
        <>
            <Fields.ApestudiesWKPRCDefaultLocation
                labMethodSettings={ labMethodSettings }
                related={ related }
                disabled={ hasSelectedSubjects }
            />
            <Fields.ForeignId
                label={ translate('Group') }
                dataXPath='$.subjectGroupId'
                collection='subjectGroup'
                constraints={{
                    '/subjectType': subjectType || '',
                    '/state/locationId': locationId || ''
                }}
                disabled={ !locationId || hasSelectedSubjects }
            />
            { subjectGroupId && (
                <>
                    {/*<GroupExpSubjectFields
                        label='Proband:innen'
                        dataXPath='$.subjectData'
                        subjectType={ subjectType }
                        subjectConstraints={ subjectConstraints }
                        enableMove={ false }
                    />*/}
                    <Fields.ForeignId
                        label={ translate('Subject') }
                        dataXPath={`$.subjectData.0.subjectId`}
                        collection='subject'
                        recordType={ subjectType }
                        constraints={ subjectConstraints }
                        required
                    />
                    <Fields.DateOnlyTimestamp required />
                    
                    <Fields.SaneString
                        label={ translate('Comment') }
                        dataXPath={`$.subjectData.0.comment`}
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
