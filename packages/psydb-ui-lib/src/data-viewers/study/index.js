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
    '/sequenceNumber': 'ID No.',
    '/state/name': '_designation',
    '/state/shorthand': 'Shorthand',
    '/state/runningPeriod/start': 'Start',
    '/state/runningPeriod/end': 'End',
    '/state/enableFollowUpExperiments': (
        'Subjects can be tested multiple times'
    ),
    '/state/researchGroupIds': 'Research Groups',
    '/state/scientistIds': 'Scientists',
    '/state/studyTopicIds': 'Study Topics',
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
        Component: SystemPermissions
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
