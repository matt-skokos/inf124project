const admin         = require('firebase-admin');
const {
  geohashForLocation,
  geohashQueryBounds,
  distanceBetween,
} = require('geofire-common');
const FavoriteModel = require('../models/favorite');

const GeoPoint = admin.firestore.GeoPoint;
const serverTs = admin.firestore.FieldValue.serverTimestamp();

// Add a favorite spot to the current user's doc.
// POST /api/favorites   { name, lat, lng }
exports.addFavorite = async (req, res) => {
    let { name, lat, lng } = req.body;
    if (!name || lat == null || lng == null) {
        return res.status(400).json({ error: 'name, lat, and lng are required' });
    }
    lat = parseFloat(lat);
    lng = parseFloat(lng);

    const uid = req.user.uid;
    const col = FavoriteModel.collection(uid);
    const geohash = geohashForLocation([lat, lng]);
    const favID = geohash;

    try {
        await col.doc(favID).set({
            name,
            location: new GeoPoint(lat, lng),
            geohash,
            addedAt: serverTs,
        }, { merge: true });
        return res.status(201).json({ message: `Added Favorites: ${name} to user #${uid}` });
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
    const snap = await FavoriteModel.collection(uid).get();
    let favorites = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    // If user has no favorites, add some default California surf spots
    if (favorites.length === 0) {
      const defaultSpots = [
        { name: "Huntington Beach", lat: 33.6595, lng: -117.9988 },
        { name: "Malibu", lat: 34.0351, lng: -118.6804 },
        { name: "Manhattan Beach", lat: 33.8847, lng: -118.4109 },
        { name: "Santa Monica", lat: 34.0195, lng: -118.4912 },
        { name: "Laguna Beach", lat: 33.5427, lng: -117.7854 }
      ];

      const col = FavoriteModel.collection(uid);
      const batch = admin.firestore().batch();

      for (const spot of defaultSpots) {
        const geohash = geohashForLocation([spot.lat, spot.lng]);
        const favID = geohash;
        const docRef = col.doc(favID);
        
        batch.set(docRef, {
          name: spot.name,
          location: new GeoPoint(spot.lat, spot.lng),
          geohash,
          addedAt: serverTs,
        });
      }

      await batch.commit();
      console.log(`Added ${defaultSpots.length} default favorites for user ${uid}`);

      // Fetch the newly added favorites
      const newSnap = await FavoriteModel.collection(uid).get();
      favorites = newSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }));
    }

    return res.json({ favorites });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return res.status(500).json({ error: 'Failed to fetch favorites' });
  }
}

exports.getLocation = async (req, res) => {
    let { lat, lng } = req.query;
    if ( lat == null || lng == null) {
        return res.status(400).json({ error: 'name, lat, and lng are required' });
    }
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    
    const geohash = geohashForLocation([lat, lng]);
    const favId = geohash; 
    const uid = req.user.uid;
    try{ 
        const doc = await FavoriteModel.doc(uid, favId).get();
        if (!doc.exists){
            return res.json({ location: null }); 
        }
        return res.json({ location: {id: doc.id, ...doc.data() }}); 
    }catch(err){
        console.error('Error checking favorite:', err);
        return res.status(500).json({ error: 'Failed to check favorite' });
    }
}

// Remove a specific favorite spot.
// DELETE /api/favorites   {favId }
exports.removeFavorite = async (req, res) => {
    const { lat, lng } = req.query;
    if (lat == null || lng == null) {
        return res.status(400).json({ error: 'name, lat, and lng are required' });
    }
    const favId = geohashForLocation([parseFloat(lat), parseFloat(lng)]);
    const uid = req.user.uid;

    try{
        // atomically remove object from array
        await FavoriteModel.doc(uid, favId).delete();
        return res.json({ message: `Removed Favorite: ${favId}` });
    }catch(err){
        console.error('Error removing favorite:', err); 
        return res.status(500).json({ error: 'Failed to remove favorite' }); 
    }
}