const admin         = require('firebase-admin');
const FavoriteModel = require('../models/favorite');

const arrayUnion  = admin.firestore.FieldValue.arrayUnion;
const arrayRemove = admin.firestore.FieldValue.arrayRemove;

// Add a favorite spot to the current user's doc.
// POST /api/favorites   { name, lat, lng }
exports.addFavorite = async (req, res) => {
    const { name, lat, lng } = req.body;
    if (!name || lat == null || lng == null) {
        return res.status(400).json({ error: 'name, lat, and lng are required' });
    }

    const uid = req.user.uid;

    try {
        // merges in the new spot into locations[] (creates the doc if needed)
        await FavoriteModel.doc(uid).set({
            locations: arrayUnion({ name, lat, lng })
        }, { merge: true });

        return res.status(201).json({ message: 'Favorite added' });
    } catch (err) {
        console.error('Error adding favorite:', err);
        return res.status(500).json({ error: 'Failed to add favorite' });
    }
}

// Get the current user's list of favorites.
// GET /api/favorites
exports.getFavorites = async (req, res) => {
  const uid = req.user.uid;
  try {
    const snap = await FavoriteModel.doc(uid).get();
    if (!snap.exists) {
      return res.json({ favorites: [] });
    }
    const locations = snap.data().locations || [];
    return res.json({ favorites: locations });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return res.status(500).json({ error: 'Failed to fetch favorites' });
  }
}

// Remove a specific favorite spot.
// DELETE /api/favorites   { name, lat, lng }
exports.removeFavorite = async (req, res) => {
    const { name, lat, lng } = req.body;
    if (!name || lat == null || lng == null) {
        return res.status(400).json({ error: 'name, lat, and lng are required' });
    }

    const uid = req.user.uid;

    try{
        // atomically remove object from array
        await FavoriteModel.doc(uid).update({
            locations: arrayRemove({ name, lat, lng})
        }); 
        return res.json({ message: "Removed favorite"})
    }catch(err){
        console.error('Error removing favorite:', err); 
        return res.status(500).json({ error: 'Failed to remove favorite' }); 
    }
}