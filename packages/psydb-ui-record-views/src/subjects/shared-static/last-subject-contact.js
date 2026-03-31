import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Row, Col, PaddedText, Button } from '@mpieva/psydb-ui-layout';

import SubjectContactHistoryModal from './subject-contact-history-modal';

const LastSubjectContact = (ps) => {
    var { show, value, uiSplit=[ 3, 9 ], className='px-3' } = ps;
    var [{ translate, fdate }] = useI18N();
    
    var historyModal = useModalReducer();
    
    if (!show) {
        return null;
    }

    if (!value) {
        return (
            <Wrapper uiSplit={ uiSplit } className={ className }>
                <span>
                    { translate('Last Contact') }
                </span>
                <b style={{ fontWeight: 600 }}>
                    <i className='text-lightgrey'>
                        { translate('Not Found') }
                    </i>
                </b>
            </Wrapper>
        )
    }

    var { type, subjectId, contactedAt, state: { comment }} = value;
    return (
        <>
            <SubjectContactHistoryModal { ...historyModal.passthrough } />

            <Wrapper uiSplit={ uiSplit } className={ className }>
                <Button
                    variant='link' className='m-0 p-0 border-0'
                    onClick={ () => historyModal.handleShow({ subjectId }) }
                >
                    { translate('Last Contact') }
                </Button>
                <div>
                    <b style={{ fontWeight: 600 }}>
                        { fdate(contactedAt, 'P p') }
                        {' '}
                        ({ type })
                    </b>
                    { comment && (
                        <>
                            <br />
                            <i>{ comment }</i>
                        </>
                    )}
                </div>
            </Wrapper>
        </>
    )
}

var Wrapper = (ps) => {
    var { uiSplit=[ 3, 9 ], className='px-3', children } = ps;
    var [ label, value ] = children;

    return (
        <Row className={ className }>
            <Col xs={ uiSplit[0] }>
                <PaddedText>
                    { label }
                </PaddedText>
            </Col>
            <Col xs={ uiSplit[1] }>
                <PaddedText>
                    { value }
                </PaddedText>
            </Col>
        </Row>
    )
}

export default LastSubjectContact;
