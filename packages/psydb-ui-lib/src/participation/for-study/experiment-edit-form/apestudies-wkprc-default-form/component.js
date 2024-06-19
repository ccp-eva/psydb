import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../../form-fields';

import {
    GroupExpSubjectFields,
    Footer,
} from '../shared';

import PerSubjectFields from './per-subject-fields';

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

    var formPass = only({ from: ps, keys: [
        'useAjvAsync',
        'ajvErrorInstancePathPrefix',
        'onSubmit'
    ]});

    var formBodyPass = only({ from: ps, keys: [
        'subjectType',
        'labMethodSettings',
        'related',
    
        'isTransmitting',
        'enableSubmit'
    ]});

    var initialValues = createInitialValues(ps);

    return (
        <DefaultForm { ...formPass } initialValues={ initialValues }>
            {(formikProps) => (
                <FormBody
                    { ...formBodyPass }
                    subjectCRTSettings={ subjectCRTSettings }
                    formik={ formikProps }
                />
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

    var footerPass = only({ from: ps, keys: [
        'isTransmitting',
        'enableSubmit'
    ]});

    var { values } = formik;
    var {
        locationId,
        subjectGroupId,
        subjectsAreTestedTogether,
        subjectData
    } = values['$'];
    
    // FIXME: we cant support multiple group fields currently
    var [ subjectGroupFieldDef ] = subjectCRTSettings.findCustomFields({
        'type': 'ForeignId',
        'props.collection': 'subjectGroup'
    });

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
                    <Fields.SaneString
                        label={ translate('_wkprc_experimentName') }
                        dataXPath='$.experimentName'
                        required
                    />
                    <Fields.DateOnlyTimestamp required />
                    <Fields.Integer
                        label={ translate('_wkprc_intradaySeqNumber') }
                        dataXPath='$.intradaySeqNumber'
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
                    <hr />
                    <PerSubjectFields
                        label={ translate('Subjects') }
                        dataXPath='$.subjectData'
                        subjectType={ subjectType }
                        subjectConstraints={ subjectConstraints }
                        enableMove={ false }
                    />
                   
                    <hr className='mt-0'/>
                    
                    <Fields.Integer
                        label={ translate('_wkprc_totalSubjectCount') }
                        dataXPath='$.totalSubjectCount'
                        required
                    />
                    {/*<Fields.ForeignId
                        label={ translate('Subject') }
                        dataXPath={`$.subjectData.0.subjectId`}
                        collection='subject'
                        recordType={ subjectType }
                        constraints={ subjectConstraints }
                        required
                    />*/}
                    
                    <Fields.ExperimentOperators />
                    
                    <Footer { ...footerPass } />
                </>
            )}
        </>
    );
}

const createInitialValues = (ps) => {
    var { experiment } = ps;
    var {
        interval, subjectData, experimentOperatorIds, ...rest
    } = experiment.state
    
    var initialValues = {
        ...only({ from: rest, paths: [
            'locationId',
            'subjectGroupId',
            'experimentName',
            'roomOrEnclosure',
            'intradaySeqNumber',
            'totalSubjectCount',
        ]}),
        timestamp: interval.start,
        subjectData: subjectData.map(it => ({
            ...only({
                from: it,
                paths: [ 'subjectId', 'role', 'comment' ],
            }),
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false
        })),
        labOperatorIds: experimentOperatorIds,
    }

    return initialValues;
}
