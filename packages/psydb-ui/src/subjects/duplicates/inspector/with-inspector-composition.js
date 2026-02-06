import React from 'react';
import { composeHOCs } from '@cdxoo/react-compose-contexts';

import withCoreAndSubjects from './with-core-and-subjects';
import withSelection from './with-selection';
import withExperiments from './with-experiments';
import withTriggers from './with-triggers';

const withInspectorComposition = composeHOCs(
    withCoreAndSubjects(),
    withSelection(),
    withExperiments(),
    withTriggers(),
);

export default withInspectorComposition;
