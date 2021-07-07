exports['makeCondition() does stuff 1'] = {
  "$cond": {
    "if": {
      "$and": [
        {
          "$and": [
            {
              "$not": {
                "$in": [
                  "$scientific.state.participatedInStudyIds",
                  [
                    "STUDY_01"
                  ]
                ]
              }
            }
          ]
        },
        {
          "$or": [
            {
              "$gt": [
                {
                  "$size": {
                    "$filter": {
                      "input": "$scientific.state.testingPermissions.canBeTestedInhouse",
                      "as": "item",
                      "cond": {
                        "$and": [
                          {
                            "$eq": [
                              "$$item.researchGroupId",
                              "RG_ALPHA"
                            ]
                          },
                          {
                            "$eq": [
                              "$$item.permission",
                              "yes"
                            ]
                          }
                        ]
                      }
                    }
                  }
                },
                0
              ]
            },
            {
              "$gt": [
                {
                  "$size": {
                    "$filter": {
                      "input": "$scientific.state.testingPermissions.canBeTestedInhouse",
                      "as": "item",
                      "cond": {
                        "$and": [
                          {
                            "$eq": [
                              "$$item.researchGroupId",
                              "RG_BETA"
                            ]
                          },
                          {
                            "$eq": [
                              "$$item.permission",
                              "yes"
                            ]
                          }
                        ]
                      }
                    }
                  }
                },
                0
              ]
            }
          ]
        },
        {
          "$or": [
            {
              "$and": [
                {
                  "$and": [
                    {
                      "$gte": [
                        "$scientific.state.custom.dateOfBirth",
                        "1923-06-04T23:00:00.000Z"
                      ]
                    },
                    {
                      "$lt": [
                        "$scientific.state.custom.dateOfBirth",
                        "2020-06-05T21:59:59.999Z"
                      ]
                    }
                  ]
                },
                {
                  "$cond": {
                    "if": {
                      "$isArray": "$scientific.state.custom.languages"
                    },
                    "then": {
                      "$gt": [
                        {
                          "$size": {
                            "$ifNull": [
                              {
                                "$setIntersection": [
                                  "$scientific.state.custom.languages",
                                  [
                                    "german"
                                  ]
                                ]
                              },
                              []
                            ]
                          }
                        },
                        0
                      ]
                    },
                    "else": {
                      "$in": [
                        "$scientific.state.custom.languages",
                        [
                          "german"
                        ]
                      ]
                    }
                  }
                }
              ]
            },
            {
              "$and": [
                {
                  "$and": [
                    {
                      "$gte": [
                        "$scientific.state.custom.dateOfBirth",
                        "1996-05-11T22:00:00.000Z"
                      ]
                    },
                    {
                      "$lt": [
                        "$scientific.state.custom.dateOfBirth",
                        "2020-06-05T21:59:59.999Z"
                      ]
                    }
                  ]
                },
                {
                  "$cond": {
                    "if": {
                      "$isArray": "$scientific.state.custom.languages"
                    },
                    "then": {
                      "$gt": [
                        {
                          "$size": {
                            "$ifNull": [
                              {
                                "$setIntersection": [
                                  "$scientific.state.custom.languages",
                                  [
                                    "english"
                                  ]
                                ]
                              },
                              []
                            ]
                          }
                        },
                        0
                      ]
                    },
                    "else": {
                      "$in": [
                        "$scientific.state.custom.languages",
                        [
                          "english"
                        ]
                      ]
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    "then": true,
    "else": false
  }
}
