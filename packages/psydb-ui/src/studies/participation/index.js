import React, { useState } from 'react';
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
        subjectRecordTypes: agent.fetchCollectionCRTs({
            collection: 'subject'
        }),
        participation: agent.fetchParticipatedSubjectsForStudy({
            studyId: id,
            sort: {
                path: sorter.sortPath,
                direction: sorter.sortDirection,
            }
        })
    }), [ id, revision.value, sorter.sortPath, sorter.sortDirection ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { dataBySubjectType } = fetched.participation.data;
    var subjectTypeKeys = Object.keys(dataBySubjectType);
    var allSubjectTypes = keyBy({
        items: fetched.subjectRecordTypes.data,
        byProp: 'type'
    });

    if (!selectedSubjectType) {
        selectedSubjectType = subjectTypeKeys[0];
    }

    var onSuccessfulUpdate = revision.up;
    var modalBag = { studyId: id, onSuccessfulUpdate };
    
    // FIXME
    var { 
        displayFieldData,
        records,
        related,
    } = fixRelated(dataBySubjectType[selectedSubjectType]);
    var definitions = __fixDefinitions(displayFieldData);

    var transformer = createDefaultFieldDataTransformer({
        related,
        //timezone,
    })

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
            
            { subjectTypeKeys > 1 && (
                <TabNav
                    activeKey={ selectedSubjectType }
                    items={ subjectTypeKeys.map(type => ({
                        key: type,
                        label: allSubjectTypes[type].label
                    }))}
                    onItemClick={ (key) => setSelectedSubjectType(key) }
                />
            )}

            <div className='mt-3'>

                { canAddSubjects && (
                    <Button onClick={ createModal.handleShow }>
                        Proband:innen hinzufügen
                    </Button>
                )}
                
                { canImportCSV && (
                    <Button
                        className='ml-2'
                        onClick={ csvImportModal.handleShow }
                    >
                        CSV-Import
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
