import React from 'react';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';

import {
    Row,
    Col,
    Form,
    Pair,
} from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';
import StudyTeamListItem from '../experiment-operator-team-list-item';

import {
    wrapOnChange,
    SlotControl
} from './base-fields';

const EndControl = (ps) => {
    var {
        end,
        minEnd,
        maxEnd,
        slotDuration,

        onChangeEnd,
    } = ps;

    var locale = useUILocale();
    var translate = useUITranslation();

    if (onChangeEnd) {
        var onChange = wrapOnChange((nextEnd) => {
            // since intervals shouldn overlap i.e. [...)
            onChangeEnd(new Date(nextEnd.getTime() - 1));
        });
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    { translate('End') }
                </Form.Label>
                <Col sm={8}>
                    <SlotControl
                        value={ end  }
                        onChange={ onChange }
                        min={ minEnd }
                        max={ maxEnd }
                        step={ slotDuration }
                    />
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Pair className='mb-2' label={ translate('End') }>
                { datefns.format(new Date(end), 'p', { locale }) }
            </Pair>
        )
    }

}

const TeamControl = (ps) => {
    var {
        teamId,
        teamRecords,
        onChangeTeamId
    } = ps;
    
    var translate = useUITranslation();

    if (onChangeTeamId) {
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    { translate('Team') }
                </Form.Label>
                <Col sm={8}>
                    {
                        teamRecords
                            .filter(it => it.state.hidden !== true)
                            .map(it => (
                                <StudyTeamListItem { ...({
                                    key: it._id,
                                    record: it,
                                    active: it._id === teamId,
                                    onClick: onChangeTeamId
                                   // studyId,
                                   // record,
                                   // relatedRecordLabels,
                                   // onClick: onSelectTeam,
                                }) } />
                            ))
                    }
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    { translate('Team') }
                </Form.Label>
                <Col sm={8}>
                    <StudyTeamListItem record={ teamRecords[0] } />
                </Col>
            </Row>
        );
    }
}

export {
    EndControl,
    TeamControl
}
