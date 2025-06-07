// src/models/user
const db = require('../db'); 
const COLLECTION = 'users'; 

module.exports = {
    collection: () => db.collection(COLLECTION), 
    doc: id => db.collection(COLLECTION).doc(id)
}