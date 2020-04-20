module.exports = ({ name }) => {
    var db = MongoConnection().getSelectedDB();
    
    var collection = {},
        raw = db.collection(name);
    Object.setPrototypeOf(collection, raw);

    return collection;
}
