import React from 'react';
import * as Fields from './fields';

export const InviteFields = (ps) => {
    var { enableTeamSelect, studyId, settings, related } = ps;
    var { locations } = settings.state;

    return (
        <>
            <Fields.Timestamp />
            <Fields.Status type='invite' />
            { 
                enableTeamSelect
                ? <Fields.Team studyId={ studyId } />
                : <Fields.ExperimentOperators />
            }
            <Fields.InviteLocation
                locations={ locations }
                related={ related }
            />
        </>
    );
}
