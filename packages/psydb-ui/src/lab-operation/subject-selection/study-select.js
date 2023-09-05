import React from 'react';

import {
    useRouteMatch,
    useParams,
    useHistory,
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSelectionReducer } from '@mpieva/psydb-ui-hooks';
import { LinkButton, OptionSelectIndicator } from '@mpieva/psydb-ui-layout';
import { StudySelectList } from '@mpieva/psydb-ui-lib';

const StudySelect = (ps) => {
    var {
        experimentType,
        singleStudy,
    } = ps;

    var { path, url } = useRouteMatch();
    var { studyType } = useParams();
    var history =  useHistory();

    var translate = useUITranslation();

    var selection = useSelectionReducer({
        selected: [],
        checkEqual: (existing, payload) => (
            existing._id === payload._id
        )
    })

    var selectedStudies = selection.value;

    return (
        <div>
            { !singleStudy && (
                <div
                    className='p-2 d-flex justify-content-between align-items-center'
                    style={{
                        position: 'sticky',
                        top: 0,
                        background: '#ffffff',
                    }}
                >
                    <b>{
                        singleStudy
                        ? '' 
                        : `${translate('Selected')}: ${selectedStudies.length}`
                    }</b>
                    <LinkButton
                        to={ `${url}/${selectedStudies.map(it => it._id).join(',')}`}
                        disabled={ selectedStudies.length < 1 }
                    >
                        { translate('Next') }
                    </LinkButton>
                </div>
            )}

            <StudySelectList
                studyRecordType={ studyType }
                experimentType={ experimentType }

                showSelectionIndicator={ singleStudy ? false : true }
                wholeRowIsClickable={ true }
                bsTableProps={{ hover: true }}
                emptyInfoText={ translate('No active studies found.') }

                selectedRecordIds={ selectedStudies.map(it => it._id) }
                onSelectRecord={ ({ type, payload }) => {
                    if (singleStudy) {
                        history.push(`${url}/${payload.record._id}`)
                    }
                    else {
                        selection[type](payload.record);
                    }
                }}
                CustomActionListComponent={
                    singleStudy ? OptionSelectIndicator : undefined
                }
            />

        </div>
    );
}

export default StudySelect;
