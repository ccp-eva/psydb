import React, { useState } from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

import CurrentView from './current-view';
import VersionDiffView from './version-diff-view';

const StudyRoadmapAndHistory = (ps) => {
    var { studyRoadmap, studyRoadmapVersions, related } = ps;
    var [{ translate, fdate }] = useI18N();
    
    var [ version, setVersion ] = useState('CURRENT');

    if (!studyRoadmap) {
        return null;
    }

    var _enum = { keys: [], labels: [] };
    for (var [ ix, it ] of studyRoadmapVersions.entries()) {
        var { updatedAt } = it._rohrpostMetadata;
        _enum.keys.unshift(ix);
        _enum.labels.unshift(fdate(updatedAt, 'P p'));
    }
    _enum.keys.unshift('CURRENT');
    _enum.labels.unshift(translate('Current Data'));

    return (
        <div>
            <hr />
            <div className='d-flex align-items-center mb-3'>
                <h5 className='flex-grow m-0'>{ translate('Roadmap') }</h5>
                <div style={{ width: '200px' }}>
                    <Controls.GenericEnum
                        value={ version }
                        onChange={ setVersion }
                        enum={ _enum }
                    />
                </div>
            </div>

            <div>
                { version === 'CURRENT' ? (
                    <CurrentView
                        record={ studyRoadmap }
                        related={ related }
                    />
                ) : (
                    <VersionDiffView
                        oldRecord={ studyRoadmapVersions[version - 1] }
                        newRecord={ studyRoadmapVersions[version] }
                        related={ related }
                    />
                ) }
            </div>
        </div>
    )
}

export default StudyRoadmapAndHistory;
