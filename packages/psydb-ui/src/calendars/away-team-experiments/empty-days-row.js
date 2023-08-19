import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Container, Col, Row } from '@mpieva/psydb-ui-layout';
import { datefns } from '@mpieva/psydb-ui-lib';

const EmptyDaysRow = (ps) => {
    var { allDays, ...pass } = ps;
    var translate = useUITranslation();

    return (
        <div { ...pass }>
            <Container style={{ maxWidth: '100%' }}>
                <Row>
                    { allDays.map((day, ix) => (
                        <Col key={ ix } className='p-1'>
                            <div className='text-muted text-center'>
                                <i>{ translate('No Appointments') }</i>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default EmptyDaysRow;
