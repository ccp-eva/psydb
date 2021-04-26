import React, { useState, useEffect, useReducer } from 'react';

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'

import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

const PlainObjectFieldTemplate = (ps) => {
    var {
        properties,
        schema,
        ...other
    } = ps;

    return (
        <div>
            { properties.map((element, index) => (
                <div key={index}>
                    { /*schema.systemType || 'undefined' */}
                    { element.content }
                </div>
            )) }
        </div>
    )
}

const DefaultObjectFieldTemplate = (ps) => {
    var {
        TitleField,
        title,
        DescriptionField,
        description,
        properties,
        required,
        uiSchema,
        idSchema,
        schema,
        ...other
    } = ps;

    return (
        <>
            {(uiSchema["ui:title"] || title) && (
                <>
                    <h5 className='mt-3'>{ title }</h5>
                    <hr
                        className="mt-1 mb-2 border-0 bg-secondary"
                        style={{ height: "1px" }}
                    />
                </>
            )}

            <Container fluid className="p-0">
                { properties.map((element, index) => (
                    <Row key={index} style={{ marginBottom: "10px" }}>
                        <Col xs={12}> {element.content}</Col>
                    </Row>
                )) }
            </Container>
        </>
    );
}

const SearchAgeFrameFieldTemplate = (ps) => {
    var {
        properties,
        ...other
    } = ps;

    return (
        <div className='d-flex'>
            { properties.map((element, index) => (
                <div key={index} className='flex-grow'>
                    { element.content }
                </div>
            )) }
        </div>
    )
}

const SearchStudySettingsFieldTemplate = (ps) => {
    var {
        properties,
        uiSchema,
        title,
        ...other
    } = ps;

    return (
        <div className='p-3 bg-light border'>
            {(uiSchema["ui:title"] || title) && (
                <>
                    <h6>Studie: <b>{ title }</b></h6>
                    <hr
                        className="mt-1 mb-1 border-0 bg-secondary"
                        style={{ height: "1px" }}
                    />
                </>
            )}
            <div>
                { properties.map((element, index) => (
                    <div key={index}>
                        { element.content }
                    </div>
                )) }
            </div>
        </div>
    )
}

const SearchConditionListFieldTemplate = (ps) => {
    var {
        properties,
        ...other
    } = ps;

    return (
        <div className='d-flex flex-wrap'>
            { properties.map((element, index) => (
                <div key={index}>
                    { element.content }
                </div>
            )) }
        </div>
    )
}

const SearchConditionValuesFieldTemplate = (ps) => {
    var {
        properties,
        schema,
        ...other
    } = ps;

    return (
        <div className='pl-2 p2-2'>
            <b>{ schema.title }</b>
            { properties.map((element, index) => (
                <div key={index}>
                    { element.content }
                </div>
            )) }
        </div>
    )
}

const ObjectFieldTemplate = (ps) => {
    var {
        TitleField,
        title,
        DescriptionField,
        description,
        properties,
        required,
        uiSchema,
        idSchema,
        schema,
        ...other
    } = ps;

    var { systemType } = schema;
    //console.log(systemType);
    switch (systemType) {
        case 'DateOnlyInterval':
            return (
                <DefaultObjectFieldTemplate { ...ps} />
            )
        case 'SearchSelectionSettings':
            return (
                <DefaultObjectFieldTemplate { ...ps} />
            )
        case 'SearchAgeFrame':
            return (
                <SearchAgeFrameFieldTemplate { ...ps} />
            )
        case 'SearchConditionList':
            return (
                <SearchConditionListFieldTemplate { ...ps} />
            )
        case 'SearchConditionValues':
            return (
                <SearchConditionValuesFieldTemplate { ...ps} />
            )
        case 'SearchStudySettings':
            return (
                <SearchStudySettingsFieldTemplate { ...ps} />
            )
        default:
            return (
                <PlainObjectFieldTemplate { ...ps} />
            )
    }
}

// XXX: this is so wierrd
Bootstrap4Theme.FieldTemplate = (ps) => {
    var { children } = ps;
    return (
        <div>{ children }</div>
    )
}
Bootstrap4Theme.ObjectFieldTemplate = ObjectFieldTemplate;
var SchemaForm = withTheme(Bootstrap4Theme);

const SelectionSettingsForm = ({
    schema,
}) => {
    return (
        <SchemaForm
            schema={ schema }
        />
    );
}

export default SelectionSettingsForm;
