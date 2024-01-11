import React from 'react';
import classnames from 'classnames';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { Button, AsyncButton } from '@mpieva/psydb-ui-layout';

const ExtraFunctionBar = (ps) => {
    var { subjectSelection, fetchBag, onClickInvite } = ps;

    var sample = useFetch((agent) => (
        agent.fetchServerTimezone()
    ), { useEffect: false });

    var selectAll = useFetch((agent) => (
        agent.searchSubjectsTestableInOnlineSurvey({
            ...fetchBag,
            output: 'only-ids'
        }).then((response) => {
            var { ids } = response.data.data;
            subjectSelection.set(ids.map(_id => ({ _id })))
            return response;
        })
    ), { useEffect: false });

    return (
        <div className={ classnames([
            'p-2 bg-white',
            'd-flex justify-content-between align-items-center'
        ]) }>
            <b>Ausgewählt: { subjectSelection.value.length }</b>

            <div className='d-flex gapx-2'>
                <AsyncButton
                    onClick={ sample.exec }
                    isTransmitting={ sample.isTransmitting }
                >
                    Sample
                </AsyncButton>

                <AsyncButton
                    onClick={ selectAll.exec }
                    isTransmitting={ selectAll.isTransmitting }
                >
                    Select All
                </AsyncButton>

                <Button
                    disabled={ subjectSelection.value.length < 1 }
                    onClick={ onClickInvite }
                >
                    Invite Selected
                </Button>
            </div>
        </div>
    )
}

export default ExtraFunctionBar;
