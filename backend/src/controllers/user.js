// src/controllers/user
const admin = require('firebase-admin');
const UserModel = require('../models/user'); 
const bcrypt = require('bcryptjs')

// Create 
exports.createUser = async (req,res) => {
    try{
        const {email, password, name, phone, skill, notifyBy } = req.body; 

        // Hash the password for any internal storage
        const hashed = await bcrypt.hash(password, 12);

        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password, 
            displayName: name,
        })

        // Create Firestore document keyed by the Firebase UID
        await UserModel.doc(userRecord.uid).set({
            email, 
            password: hashed, 
            name,
            phone,
            skill,
            notifyBy,
            pic: null,
            createdAt: new Date(), 
            updatedAt: new Date()
        })

        // Respond with new user's details
        res.status(201).json({ 
            id: userRecord.uid, 
            email: userRecord.email, 
            name: userRecord.displayName,
            phone,
            skill,
            notifyBy
        }); 
    }catch (err){
        console.error(`Error: ${err.message}`)
        res.status(400).json({ error: err.message})
    }
};

// Read All 
exports.listUsers = async (req,res) => {
    try{
        const snapshot = await UserModel.collection().get(); 
        const users = snapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data(), 
            password: undefined
        }));
        res.json(users)
    } catch (err){
        res.status(500).json({error: err.message})
    }
}; 

// Read One
exports.getUser = async (req, res) => {
    try{
        const doc = await UserModel.doc(req.params.id).get(); 
        if(!doc.exists) return res.status(404).json({ error: 'User not found'}); 
        const data = doc.data(); 
        delete  data.password; 
        res.json({id:doc.id, ...data}); 
    } catch(err){
        res.status(500).json({ error: err.message})
    }
};

// Update
exports.updateUser = async (req,res) => {
    try{
        const uid = req.params.id
        const updates = {...req.body, updatedAt: new Date()}; 
        
        // if password is being updated, hash it and update Auth
        if(updates.password){
            updates.password = await bcrypt.hash(updates.password, 12);
            await admin.auth().updateUser(uid, {paassword: req.body.password}); 
        }

        // If email is updated, update Firebase Auth
        if (req.body.email){
            updates.email = req.body.email; 
            await admin.auth().updateUser(uid, {email: req.body.email});
        }

        // Update Firestore document
        await UserModel.doc(req.params.id).update(updates); 
        const updatedDoc = await UserModel.doc(req.params.id).get(); 
        const data = updatedDoc.data(); 
        delete data.password;

        res.json({id: updatedDoc.id, ...data}); 
    } catch(err){
        res.status(400).json({error: err.message})
    }
}

// Delete
exports.deleteUser = async (req,res) => {
    try{
        const uid = req.params.id; 

        // Delete from Firebase Auth 
        await admin.auth().deleteUser(uid);

        // Delete Firestore document
        await UserModel.doc(req.params.id).delete();

        res.json({message: `user ${uid} deleted from Auth and Firestore`})
    } catch{
        res.status(500).json({error: err.message})
    }
}