import React from 'react'
import { useRouteMatch, useParams, useHistory } from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    PageWrappers,
    OptionSelectIndicator,
} from '@mpieva/psydb-ui-layout';

import { StudySelectList } from '@mpieva/psydb-ui-lib';


const Landing = (ps) => {
    var translate = useUITranslation();
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();
    var history =  useHistory();
    
    return (
        <PageWrappers.Level3 title={ translate('Study Selection') }>
            <StudySelectList
                studyRecordType={ studyType }
                experimentTypes={[
                    'inhouse',
                    'online-video-call',
                    'away-team'
                ]}

                showSelectionIndicator={ false }
                wholeRowIsClickable={ true }
                bsTableProps={{ hover: true }}

                selectedRecordIds={[]}
                onSelectRecord={ ({ type, payload }) => {
                    history.push(`${url}/${payload.record._id}`)
                }}
                CustomActionListComponent={ OptionSelectIndicator }
            />
        </PageWrappers.Level3>
    )
}

export default Landing;
