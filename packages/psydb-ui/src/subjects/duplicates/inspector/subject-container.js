import React from 'react';
import SubjectEditor from './subject-editor';
import SubjectExperiments from './subject-experiments';

const SubjectContainer = (ps) => {
    var {
        subjectRecord,
        subjectRelated,
        subjectCRTSettings,

        experiments,
        onSuccessfulEdit
    } = ps;

    return (
        <>
            <div className='bg-light border p-3 mb-3'>
                <SubjectEditor
                    record={ subjectRecord }
                    related={ subjectRelated }
                    crtSettings={ subjectCRTSettings }
                    onSuccessfulUpdate={ onSuccessfulEdit }
                />
            </div>
            <div className='bg-light border p-3'>
                <SubjectExperiments { ...experiments } />
            </div>
        </>
    )
}

export default SubjectContainer
