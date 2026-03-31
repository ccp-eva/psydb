import React, { useState } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';
import { __fixRelated, __fixDefinitions } from '@mpieva/psydb-common-compat';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';

import {
    useFetchAll,
    usePermissions,
    useRevision,
    useModalReducer,
    useSortReducer,
} from '@mpieva/psydb-ui-hooks';

import { Button, TabNav, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { CreateModal } from '@mpieva/psydb-ui-lib/src/participation/for-study';
import ParticipationList from './participation-list';
import WKPRCCSVExportButton from './wkprc-csv-export-button';

const StudyParticipation = (ps) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var { dev_enableWKPRCPatches: IS_WKPRC } = useUIConfig();
    var [{ translate, locale, language }] = useI18N();

    var permissions = usePermissions();
    var canAddSubjects = permissions.hasFlag('canWriteParticipation');

    var revision = useRevision();
    var createModal = useModalReducer();
    
    var initialSort = {
        sortPath: 'scientific.state.internals.participatedInStudies.timestamp',
        sortDirection: 'asc',
    }
    
    var sorter = useSortReducer(initialSort);

    var [ selectedSubjectType, setSelectedSubjectType ] = useState();

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        subjectTypeInfos: agent.fetchStudySubjectTypeInfos({
            studyId: id,
        }),
        participation: agent.fetchParticipatedSubjectsForStudy({
            studyId: id,
            subjectType: selectedSubjectType,
            sort: {
                path: sorter.sortPath,
                direction: sorter.sortDirection,
            }
        })
    }), [
        id, selectedSubjectType,
        revision.value,
        sorter.sortPath, sorter.sortDirection,
    ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { subjectTypeInfos, participation } = fetched._stageDatas;

    if (!selectedSubjectType) {
        selectedSubjectType = subjectTypeInfos[0].type;
    }
    
    var selectedSubjectTypeInfo = subjectTypeInfos.find(it => (
        it.type === selectedSubjectType
    ));
    
    var {
        displayFieldDefinitions: definitions
    } = selectedSubjectTypeInfo;

    var { dataBySubjectType } = participation;
    // FIXME
    var { 
        records = [],
        related = {},
    } = __fixRelated(dataBySubjectType[selectedSubjectType] || {});
    definitions = __fixDefinitions(definitions);

    var onSuccessfulUpdate = revision.up;
    var modalBag = { studyId: id, onSuccessfulUpdate };
    
    return (
        <div className=''>

            <CreateModal
                { ...modalBag }
                { ...createModal.passthrough }
                subjectRecordType={ selectedSubjectType }
            />

            <div className=''>
                <div className='d-flex justify-content-between align-items-center'>
                    <TabNav
                        activeKey={ selectedSubjectType }
                        items={ subjectTypeInfos.map(it => ({
                            key: it.type,
                            label: translate.crt(it),
                        }))}
                        onItemClick={ (key) => setSelectedSubjectType(key) }
                    />
                    <div className='d-flex gapx-3'>
                        { canAddSubjects && (
                            <Button size='sm' onClick={ createModal.handleShow }>
                                {'+ '}{ translate('Add Participation') }
                            </Button>
                        )}
                        { IS_WKPRC && (
                            <WKPRCCSVExportButton
                                size='sm'
                                endpoint='wkprc-csv-export/participation'
                                outputName='participation-export.csv'
                                studyId={ id }
                                subjectType={ selectedSubjectType }
                            />
                        )}
                    </div>
                </div>

                <ParticipationList { ...({
                    className: 'mt-1 bg-white',
                    studyId: id,
                    records,
                    related,
                    definitions,
                    sorter,
                    onSuccessfulUpdate,
                }) } />
            </div>

        </div>
    )
}

export default StudyParticipation;
