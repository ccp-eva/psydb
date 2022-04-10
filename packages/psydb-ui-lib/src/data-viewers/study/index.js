import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    Custom,
    SaneString,
    ForeignIdList,
    DateOnlyServerSide,
    DefaultBool,
    SystemPermissions,
} from '../utility-components';

import ExtraDescription from './extra-description';

const labels = {
    '/sequenceNumber': 'ID Nr.',
    '/state/name': 'Name',
    '/state/shorthand': 'Kürzel',
    '/state/runningPeriod/start': 'Beginn',
    '/state/runningPeriod/end': 'Ende',
    '/state/enableFollowUpExperiments': (
        'Probanden können mehrfach getestet werden'
    ),
    '/state/researchGroupIds': 'Forschungsgruppen',
    '/state/scientistIds': 'Wissenschaftler',
    '/state/studyTopicIds': 'Themengebiete',
    '/state/systemPermissions': 'Zugriff auf diesen Datensatz für'
}

const [ Study, StudyContext ] = createBase();
addComponents(Study, StudyContext, labels, [
    {
        cname: 'SequenceNumber',
        path: '/sequenceNumber',
        Component: withPair(SaneString)
    },
    { cname: 'Name', path: '/state/name' },
    { cname: 'Shorthand', path: '/state/shorthand' },
    {
        cname: 'Start',
        path: '/state/runningPeriod/start',
        Component: withPair(DateOnlyServerSide)
    },
    {
        cname: 'End',
        path: '/state/runningPeriod/end',
        Component: withPair(DateOnlyServerSide)
    },
    {
        cname: 'EnableFollowUpExperiments',
        path: '/state/enableFollowUpExperiments',
        Component: withPair(DefaultBool)
    },
    {
        cname: 'ResearchGroupIds',
        path: '/state/researchGroupIds',
        Component: withPair((ps) => (
            <ForeignIdList
                { ...ps }
                props={{ collection: 'researchGroup' }}
            />
        ))
    },
    {
        cname: 'ScientistIds',
        path: '/state/scientistIds',
        Component: withPair((ps) => (
            <ForeignIdList
                { ...ps }
                props={{ collection: 'personnel' }}
            />
        ))
    },
    {
        cname: 'StudyTopicIds',
        path: '/state/studyTopicIds',
        Component: withPair((ps) => (
            <ForeignIdList
                { ...ps }
                props={{ collection: 'studyTopic' }}
            />
        ))
    },
    
    {
        cname: 'SystemPermissions',
        path: '/state/systemPermissions',
        Component: withPair(SystemPermissions)
    },

    { cname: 'Custom', path: '/state/custom', Component: Custom },
    // { prop: 'customGdpr', Component: CustomGdpr }
    // { prop: 'customScientific', Component: CustomScientific }
    {
        cname: 'ExtraDescription',
        Component: ExtraDescription
    }
]);

export default Study;
