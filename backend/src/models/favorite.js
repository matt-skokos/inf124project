// src/models/favorite
const db = require('../db'); 
const COLLECTION = 'favorites'; 

module.exports = {
    collection: () => db.collection(COLLECTION), 
    doc: id => db.collection(COLLECTION).doc(id)
}