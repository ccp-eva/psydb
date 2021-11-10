var MatchAlwaysStage = () => (
    { $match : {
        $expr : { $eq : [1, 1] }
    }}
);

module.exports = MatchAlwaysStage;
