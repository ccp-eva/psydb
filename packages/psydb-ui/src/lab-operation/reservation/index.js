import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import RecordPicker from './record-picker';

const Reservation = () => {
    var { path, url } = useRouteMatch();
    var { studyType, studyId } = useParams();
    var history =  useHistory();

    var [ studyRecord, setStudyRecord ] = useState();
    var [ isInitialized, setIsInitialized ] = (
        useState(studyId ? false : true)
    );

    useEffect(() => {
        if (studyId) {
            agent.readRecord({
                collection: 'study',
                recordType: studyType,
                studyId: studyId,
            })
            .then((response) => {
                setStudyRecord(response.data.data.record);
                setIsInitalized(true)
            });
        }
    }, [ studyType, studyId ]);

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }


    return (
        <>
            <RecordPicker
                collection='study'
                recordType={ studyType }
                value={ studyRecord }
                onChange={ (nextStudyRecord) => {
                    history.push(`${url}/${nextStudyRecord._id}`)
                } }
            />
            <div>select study</div>
            <div>show tabs teams/rooms</div>
            <div>if rooms select room</div>
            <div>show reservation calendar(s)</div>
        </>
    );
}

export default Reservation;
