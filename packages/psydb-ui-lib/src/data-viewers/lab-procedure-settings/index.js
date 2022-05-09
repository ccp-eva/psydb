import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import SubjectFieldRequirements from './subject-field-requirements';


const labels = {
    '/state/subjectsPerExperiment': 'Proband:innen pro Termin',
    '/state/subjectFieldRequirements': 'Terminbedingungen',
}

const [ LabProcedureSettings, Context ] = createBase();
addComponents(LabProcedureSettings, Context, labels, [
    { 
        cname:'SubjectsPerExperiment',
        path: '/state/subjectsPerExperiment'
    },
    {
        cname: 'SubjectFieldRequirements',
        path: '/state/subjectFieldRequirements',
        Component: withPair(SubjectFieldRequirements)
    }
]);

export default LabProcedureSettings;
