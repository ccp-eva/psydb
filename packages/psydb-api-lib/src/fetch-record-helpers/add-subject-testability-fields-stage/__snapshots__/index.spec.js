exports['AddSubjectTestabilityFieldsStage() does stuff 1'] = {
  "$addFields": {
    "_ageFrameField": "$scientific.state.custom.dateOfBirth",
    "_testableIn_STUDY_01": {
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
                          "$isArray": "$scientific.state.custom.fruits"
                        },
                        "then": {
                          "$gt": [
                            {
                              "$size": {
                                "$ifNull": [
                                  {
                                    "$setIntersection": [
                                      "$scientific.state.custom.fruits",
                                      [
                                        "BANANA_ID"
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
                            "$scientific.state.custom.fruits",
                            [
                              "BANANA_ID"
                            ]
                          ]
                        }
                      }
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
                                        "ENGLISH_ID"
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
                              "ENGLISH_ID"
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
    },
    "_testableIn_STUDY_02": {
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
                        "STUDY_02"
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
                            "2019-01-11T23:00:00.000Z"
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
                          "$isArray": "$scientific.state.custom.fruits"
                        },
                        "then": {
                          "$gt": [
                            {
                              "$size": {
                                "$ifNull": [
                                  {
                                    "$setIntersection": [
                                      "$scientific.state.custom.fruits",
                                      [
                                        "BANANA_ID"
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
                            "$scientific.state.custom.fruits",
                            [
                              "BANANA_ID"
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
  }
}
