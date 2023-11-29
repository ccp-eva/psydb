import React, { useState } from 'react';
import {
    useUILocale,
    useUILanguage,
    useUITranslation,
} from '@mpieva/psydb-ui-contexts';
import { useRouteMatch, useParams } from 'react-router-dom';

import { keyBy } from '@mpieva/psydb-core-utils';
import { createDefaultFieldDataTransformer } from '@mpieva/psydb-common-lib';
import { fixRelated, __fixDefinitions } from '@mpieva/psydb-ui-utils';

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

import { CreateModal } from '@mpieva/psydb-ui-lib/src/participation';
import ParticipationList from './participation-list';
import CSVImportModal from './csv-import-modal';


const StudyParticipation = (ps) => {
    var {
        // inModal = true
    } = ps;

    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var revision = useRevision();

    var locale = useUILocale();
    var translate = useUITranslation();
    var [ language ] = useUILanguage();

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
    } = fixRelated(dataBySubjectType[selectedSubjectType] || {});

    var transformer = createDefaultFieldDataTransformer({
        related,
        //timezone,
        locale
    })

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
            
            { subjectTypeInfos > 1 && (
                <TabNav
                    activeKey={ selectedSubjectType }
                    items={ sbjectTypeInfos.map(it => ({
                        key: it.type,
                        label: (
                            (it.displayNameI18N || {})[language]
                            || it.displayName
                        )
                    }))}
                    onItemClick={ (key) => setSelectedSubjectType(key) }
                />
            )}

            <div className='mt-3'>

                { canAddSubjects && (
                    <Button onClick={ createModal.handleShow }>
                        { translate('Add Participation') }
                    </Button>
                )}
                
                { canImportCSV && (
                    <Button
                        className='ml-2'
                        onClick={ csvImportModal.handleShow }
                    >
                        { translate('CSV Import') }
                    </Button>
                )}

                <ParticipationList { ...({
                    className: 'mt-1 bg-white',
                    records,
                    related,
                    definitions,
                    transformer,
                    sorter,
                    onSuccessfulUpdate,
                }) } />
            </div>

        </div>
    )
}

export default StudyParticipation;
