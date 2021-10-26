import React from 'react'
import { useRouteMatch, useParams, useHistory } from 'react-router-dom';
import { PageWrappers, Icons } from '@mpieva/psydb-ui-layout';
import { RecordPicker } from '@mpieva/psydb-ui-lib';

import StudySelectList from '@mpieva/psydb-ui-lib/src/study-select-list';

const Landing = (ps) => {
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();
    var history =  useHistory();
    return (
        <PageWrappers.Level3 title='Studienauswahl'>
            {/*<div className='m-3 text-muted'>
                <i>
                    Bitte auswählen für welche Studie Reservierungen
                    {' '}
                    angelegt werden sollen.
                </i>
            </div>*/}
            {/*<RecordPicker
                collection='study'
                recordType={ studyType }
                onChange={ (nextStudyRecord) => {
                    history.push(`${url}/${nextStudyRecord._id}`)
                }}
            />*/}

            <StudySelectList
                studyRecordType={ studyType }

                showSelectionIndicator={ false }
                wholeRowIsClickable={ true }
                bsTableProps={{ hover: true }}

                selectedRecordIds={[]}
                onSelectRecord={ ({ type, payload }) => {
                    history.push(`${url}/${payload.record._id}`)
                }}
                CustomActionListComponent={ SelectionIndicator }
            />
        </PageWrappers.Level3>
    )
}

const SelectionIndicator = (ps) => {
    return (
        <div className='text-primary'>
            <Icons.ChevronDoubleRight style={{
                marginTop: '-4px',
                width: '20px',
                height: '20px',
            }}/> 
        </div>
    )
}

export default Landing;
