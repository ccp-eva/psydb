import React from 'react';
import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';
import { Alert, Table } from '@mpieva/psydb-ui-layout';

import SubjectCell from './subject-cell';
import ExperimentCell from './experiment-cell';
import PostprocessingCells from './postprocessing-cells';
import ConsentPostprocessModal from './consent-postprocess-modal';

import { TableFallback, Cell, getStudyLabel } from './utils';
const enableStudyConsentWorkflow = true;

const InhouseList = (ps) => {
    var {
        experimentType, subjectType,
        subjectCRT, records, related,
        onSuccessfulUpdate
    } = ps;

    var [{ translate }] = useI18N();
    var { dev_enableStudyConsentWorkflow } = useUIConfig();

    subjectCRT = CRTSettings({ data: subjectCRT }); // FIXME

    var shouldHaveStudyConsentDoc = (
        dev_enableStudyConsentWorkflow
        && enableStudyConsentWorkflow && experimentType === 'inhouse'
    );

    var renderedHead = <TableHead hasConsent={ shouldHaveStudyConsentDoc } />
    if (records.length < 1) {
        return <TableFallback renderedTableHead={ renderedHead } text={
            translate('No unprocessed appointments found.')
        } />
    }

    var sharedBag = {
        experimentType, subjectCRT, related,
        shouldHaveStudyConsentDoc, onSuccessfulUpdate
    }

    return (
        <Table>
            { renderedHead }
            <tbody>
                { records.map((it, ix) => (
                    <ExperimentSubjectItems
                        key={ ix } experimentRecord={ it } { ...sharedBag }
                    />
                )) }
            </tbody>
        </Table>
    )
}

const ExperimentSubjectItems = (ps) => {
    var {
        experimentType, experimentRecord, 
        subjectCRT, related,

        shouldHaveStudyConsentDoc,
        onSuccessfulUpdate
    } = ps;

    var { _id: experimentId } = experimentRecord;
    var { studyId, subjectData } = experimentRecord.state;
    
    var studyLabel = getStudyLabel({ related, studyId });
    
    var subjectType = subjectCRT.getType();
    subjectData = subjectData.filter(it => (
        it.subjectType === subjectType && it.participationStatus === 'unknown'
    ));

    var sharedBag = { experimentRecord, onSuccessfulUpdate };
    return subjectData.map((it, ix) => {
        var { subjectId } = it;
        return (
            <tr key={ `${experimentId}_${subjectId}` }>
                <SubjectCell
                    { ...sharedBag }
                    subjectCRT={ subjectCRT } related={ related }
                    subjectData={ it }
                />
                <ExperimentCell experimentRecord={ experimentRecord } />
                <Cell>{ studyLabel }</Cell>

                <PostprocessingCells
                    { ...sharedBag }
                    shouldHaveStudyConsentDoc={ shouldHaveStudyConsentDoc }
                    subjectData={ it }
                />
            </tr>
        );
    });
}

const TableHead = (ps) => {
    var { hasConsent } = ps;
    var [{ translate }] = useI18N();

    return (
        <thead>
            <tr>
                <th>{ translate('Subject') }</th>
                <th>{ translate('Date') }</th>
                <th>{ translate('Study') }</th>
                { hasConsent && (
                    <th>{ translate('Consent Doc') }</th>
                )}
                <th>{ translate('Status') }</th>
            </tr>
        </thead>
    );
}

export default InhouseList;
