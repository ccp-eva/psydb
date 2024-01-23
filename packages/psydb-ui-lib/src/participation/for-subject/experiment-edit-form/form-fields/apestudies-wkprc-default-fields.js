import React from 'react';
import * as Fields from './fields';

export const ApestudiesWKPRCDefaultFields = (ps) => {
    var { studyId, settings, related } = ps;
    var { locations } = settings.state;

    return (
        <>
            <Fields.Timestamp />
            <Fields.ForeignIdList
                label='Themengebiet'
                dataXPath='$.studyTopicIds'
                collection='studyTopic'
            />
            <Fields.SaneString
                label='Test-Bezeichnung'
                dataXPath='$.experimentName'
            />
            <Fields.ApestudiesWKPRCDefaultLocation
                locations={ locations }
                related={ related }
            />
            <Fields.ForeignId
                label='Principal Investigator'
                dataXPath='$.principalInvestigatorId'
                collection='personnel'
            />
            <Fields.ExperimentOperators />
        </>
    );
}
