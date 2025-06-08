// src/models/favorite
const db = require('../db');

const SUBCOL = 'favorites';

module.exports = {
  // returns a CollectionReference to users/{uid}/favorites
  collection: (uid) =>
    db.collection('users').doc(uid).collection(SUBCOL),

  // returns a DocumentReference to users/{uid}/favorites/{favId}
  doc: (uid, favId) =>
    db.collection('users').doc(uid)
      .collection(SUBCOL)
      .doc(favId),
}