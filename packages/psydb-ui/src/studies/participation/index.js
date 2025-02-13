import React, { useState } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';
import { __fixRelated, __fixDefinitions } from '@mpieva/psydb-common-compat';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import {
    useFetchAll,
    usePermissions,
    useRevision,
    useModalReducer,
    useSortReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    LoadingIndicator,
    TabNav,
} from '@mpieva/psydb-ui-layout';

import { CreateModal } from '@mpieva/psydb-ui-lib/src/participation/for-study';
import ParticipationList from './participation-list';
import CSVImportModal from './csv-import-modal';


const StudyParticipation = (ps) => {
    var {
        // inModal = true
    } = ps;

    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [{ translate, locale, language }] = useI18N();
    var revision = useRevision();

    var permissions = usePermissions();
    var canAddSubjects = permissions.hasFlag('canWriteParticipation');
    var canImportCSV = permissions.isRoot();

    var createModal = useModalReducer();
    var csvImportModal = useModalReducer();
    
    var initialSort = {
        sortPath: 'scientific.state.internals.participatedInStudies.timestamp',
        sortDirection: 'asc',
    }
    //var sorter = (
    //    inModal
    //    ? useSortReducer(initialSort)
    //    : useSortURLSearchParams(initialSort)
    //);
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
        <div className='mt-3'>

            <CreateModal
                { ...modalBag }
                { ...createModal.passthrough }
                subjectRecordType={ selectedSubjectType }
            />

            <CSVImportModal
                { ...modalBag }
                { ...csvImportModal.passthrough }
            />
            
            <div className='mt-3'>
                <div className='d-flex justify-content-between align-items-center'>
                    { subjectTypeInfos.length > 1 ? (
                        <TabNav
                            activeKey={ selectedSubjectType }
                            items={ subjectTypeInfos.map(it => ({
                                key: it.type,
                                label: (
                                    (it.displayNameI18N || {})[language]
                                    || it.displayName
                                )
                            }))}
                            onItemClick={ (key) => setSelectedSubjectType(key) }
                        />
                    ) : (
                        <div />
                    )}
                    <div>
                        { canAddSubjects && (
                            <Button onClick={ createModal.handleShow }>
                                { translate('Add Participation') }
                            </Button>
                        )}
                        
                        {/* canImportCSV && (
                            <Button
                                className='ml-2'
                                onClick={ csvImportModal.handleShow }
                            >
                                { translate('CSV Import') }
                            </Button>
                        )*/}
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
