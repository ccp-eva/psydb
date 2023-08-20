import React from 'react';
import enums from '@mpieva/psydb-schema-enums';

import { groupBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';

const SubjectLabelOnlyModalBody = (ps) => {
    var { experimentData } = ps;
    var { record, relatedRecords } = experimentData;
    
    var grouped = groupBy({
        items: (
            record.state.subjectData.filter(it => (
                !enums.unparticipationStatus.keys.includes(
                    it.participationStatus
                )
            ))
        ),
        byProp: 'subjectType'
    });

    return (
        <div className='border bg-white px-3 py-2'>
            { Object.keys(grouped).map((g, ix) => (
                <div>
                    { ix !== 0 && (
                        <br />
                    )}
                    { grouped[g].map(it => (
                        <>
                            { relatedRecords.subject[it.subjectId]._recordLabel }
                            <br />
                        </>
                    ))}
                </div>
            ))}
        </div>
    )
}

const SubjectLabelOnlyModal = WithDefaultModal({
    title: 'Subjects (short)',
    size: 'md',
    //bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: SubjectLabelOnlyModalBody,
});

export const SubjectLabelOnlyContainer = (ps) => {
    var { experimentData } = ps; 

    var translate = useUITranslation();
    var modal = useModalReducer();

    return (
        <>
            <Button 
                size='sm'
                variant='secondary'
                className='mr-3'
                onClick={ modal.handleShow }
            >
                { translate('Only Names') }
            </Button>
            <SubjectLabelOnlyModal
                { ...modal.passthrough }
                experimentData={ experimentData }
            />
        </>
    );
};

