import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

import datefns from '../date-fns';
import Pair from '../pair';
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

    if (onChangeEnd) {
        var onChange = wrapOnChange((nextEnd) => {
            // since intervals shouldn overlap i.e. [...)
            onChangeEnd(new Date(nextEnd.getTime() - 1));
        });
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    Ende
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
            <Pair className='mb-2' label='Ende'>
                { datefns.format(new Date(end), 'p') }
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

    if (onChangeTeamId) {
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    Team
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
                    Team
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
