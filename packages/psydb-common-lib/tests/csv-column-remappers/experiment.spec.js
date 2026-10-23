'use strict';
var { expect } = require('chai');
var { CSVColumnRemappers } = require('../../src');

describe('csv-column-remappers/experiment', () => {
    for (var key of [ 'Inhouse', 'AwayTeam', 'ManualOnlyParticipation' ]) {
        describe(key, () => {
            var remapper = CSVColumnRemappers.Experiment[key]();

            it('csv2obj accepts both xxxId and legacy columns', () => {
                var csv2obj = (colkey) => remapper.csv2obj({ colkey });

                for (var col of [ 'subjectId', 'subject' ]) {
                    expect(csv2obj(col)).to.eql('subjectData[0].subjectId');
                }
                for (var col of [ 'locationId', 'location' ]) {
                    expect(csv2obj(col)).to.eql('locationId');
                }
                for (var col of [ 'experimenterId', 'experimenter' ]) {
                    expect(csv2obj(col)).to.eql('experimentOperatorIds[0]');
                    expect(csv2obj(`${col}[1]`)).to.eql(
                        'experimentOperatorIds[1]'
                    );
                }
                expect(csv2obj('subjectIdx')).to.eql(undefined);
            });

            it('ajvpath2csv reports xxxId columns', () => {
                var ajvpath2csv = (path) => remapper.ajvpath2csv({ path });

                expect(ajvpath2csv('subjectData[0].subjectId')).to.eql([
                    'subjectId'
                ]);
                expect(ajvpath2csv('locationId')).to.eql([ 'locationId' ]);
                expect(ajvpath2csv('experimentOperatorIds')).to.eql([
                    'experimenterId'
                ]);
            });
        });
    }

    describe('OnlineSurvey', () => {
        var remapper = CSVColumnRemappers.Experiment.OnlineSurvey();

        it('accepts both subjectId and subject', () => {
            for (var colkey of [ 'subjectId', 'subject' ]) {
                expect(remapper.csv2obj({ colkey })).to.eql(
                    'subjectData[0].subjectId'
                );
            }
            expect(remapper.ajvpath2csv({
                path: 'subjectData[0].subjectId'
            })).to.eql([ 'subjectId' ]);
        });
    });
});
