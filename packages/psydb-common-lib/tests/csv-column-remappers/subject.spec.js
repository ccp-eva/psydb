'use strict';
var { expect } = require('chai');
var { CSVColumnRemappers } = require('../../src');

describe('csv-column-remappers/subject', () => {
    it('csv2obj', () => {
        var subjectCRT = {
            allCustomFields: () => ([
                {
                    key: 'some_string',
                    systemType: 'SaneString',
                    subChannel: 'gdpr',
                    pointer: '/gdpr/state/custom/some_string',
                    props: {},
                },
                {
                    key: 'some_hsi_list',
                    systemType: 'HelperSetItemIdList',
                    subChannel: 'scientific',
                    pointer: '/scientific/state/custom/some_hsi_list',
                    props: {},
                }
            ])
        };

        var remapper = CSVColumnRemappers.SubjectDefault({ subjectCRT });
        
        var a = remapper.csv2obj({ colkey: 'some_string' });
        var b = remapper.csv2obj({ colkey: 'some_hsi_list[0]' });

        console.log({ a, b });
        expect(a).to.eql('gdpr.state.custom.some_string');
        expect(b).to.eql('scientific.state.custom.some_hsi_list.0');


    })
})
