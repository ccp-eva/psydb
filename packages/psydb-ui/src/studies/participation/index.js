import React, { useState } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { keyBy } from '@mpieva/psydb-common-lib';

import {
    useFetchAll,
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


const StudyParticipation = (ps) => {
    var {
        // inModal = true
    } = ps;

    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var revision = useRevision();
    var modalReducer = useModalReducer();
    
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

    return (
        <div className='mt-3'>

            <CreateModal
                { ...modalReducer.passthrough }
                onSuccessfulUpdate={ revision.up }
                studyId={ id }
                subjectRecordType={ selectedSubjectType }
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

                <Button onClick={ modalReducer.handleShow }>
                    Proband:innen hinzufügen
                </Button>

                <ParticipationList
                    className='mt-1 bg-white'
                    sorter={ sorter }
                    onSuccessfulUpdate={ revision.up }
                    { ...dataBySubjectType[selectedSubjectType] } 
                />
            </div>

        </div>
    )
}

export default StudyParticipation;
