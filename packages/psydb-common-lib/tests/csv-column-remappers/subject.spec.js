'use strict';
var { expect } = require('chai');
var { CSVColumnRemappers } = require('../../src');

describe('csv-column-remappers/subject', () => {
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
            },
            {
                key: 'address',
                systemType: 'Address',
                subChannel: 'gdpr',
                pointer: '/gdpr/state/custom/address',
                props: {},
            },
            {
                key: 'phones',
                systemType: 'PhoneWithTypeList',
                subChannel: 'gdpr',
                pointer: '/gdpr/state/custom/phones',
                props: {},
            }
        ])
    };

    it('csv2obj', () => {
        var remapper = CSVColumnRemappers.SubjectDefault({ subjectCRT });
        
        var a = remapper.csv2obj({ colkey: 'some_string' });
        var b = remapper.csv2obj({ colkey: 'some_hsi_list[0]' });

        console.log({ a, b });
        expect(a).to.eql('gdpr.state.custom.some_string');
        expect(b).to.eql('scientific.state.custom.some_hsi_list.0');
    });

    it('ajvpath2csv', () => {
        var remapper = CSVColumnRemappers.SubjectDefault({ subjectCRT });
        
        var a = remapper.ajvpath2csv({
            path: 'gdpr.state.custom.some_string',
        });
        var b = remapper.ajvpath2csv({
            path: 'scientific.state.custom.some_hsi_list[0]'
        });

        console.log({ a, b });
        expect(a).to.eql([ 'some_string' ]);
        expect(b).to.eql([ 'some_hsi_list[0]' ]);
    })

    it('address columns per part', () => {
        var remapper = CSVColumnRemappers.SubjectDefault({ subjectCRT });

        expect(remapper.csv2obj({ colkey: 'address.street' })).to.eql(
            'gdpr.state.custom.address.street'
        );
        expect(remapper.csv2obj({ colkey: 'address.country' })).to.eql(
            'gdpr.state.custom.address.country'
        );
        expect(remapper.mappings.csv2obj).to.not.have.property('address');

        expect(remapper.ajvpath2csv({
            path: 'gdpr.state.custom.address.city'
        })).to.eql([ 'address.city' ]);
    })

    it('list item sub keys', () => {
        var remapper = CSVColumnRemappers.SubjectDefault({ subjectCRT });

        expect(remapper.csv2obj({ colkey: 'phones[1].type' })).to.eql(
            'gdpr.state.custom.phones.1.type'
        );
        expect(remapper.csv2obj({ colkey: 'unknown[0]' })).to.eql(undefined);
        expect(remapper.ajvpath2csv({
            path: '.gdpr.state.custom.phones[1].number'
        })).to.eql([ 'phones[1].number' ]);
    })
})
