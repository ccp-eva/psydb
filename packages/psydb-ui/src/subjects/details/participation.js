import React from 'react';

import {
    useRouteMatch,
    useParams
} from 'react-router-dom';

import jsonpointer from 'jsonpointer';

import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import ParticipationList from './participation-list';

const Participation = ({ id, revision }) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        return {
            fetchRecordTypeMetadata: agent.readCustomRecordTypeMetadata(),
            fetchParticipationData: agent.fetchParticipatedStudiesForSubject({
                subjectId: id,
            })
        }
    }, [ id, revision ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

    var {
        fetchRecordTypeMetadata: { data: recordTypeMetadata },
        fetchParticipationData: { data: participationData }
    } = fetched;

    return (
        <div>
            <ParticipationByType {...({
                participationData
            }) }/>
        </div>
    );
}

const ParticipationByType = ({
    participationData
}) => {

    var {
        subjectData,
        participationByStudyType
    } = participationData;

    var ageFrameField = subjectData.displayFieldData.find(it => (
        it.props.isSpecialAgeFrameField
    ));

    var ageFrameFieldValue = undefined;
    if (ageFrameField) {
        ageFrameFieldValue = jsonpointer.get(
            subjectData.record,
            ageFrameField.dataPointer
        );
    }

    var studyTypes = Object.keys(participationByStudyType);

    return (
        <>
            { studyTypes.map(type => (
                <ParticipationList { ...({
                    key: type,
                    ageFrameField,
                    ageFrameFieldValue,
                    ...participationByStudyType[type]
                })} />
            )) }
        </>
    )
}


export default Participation;
