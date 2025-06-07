const admin = require('firebase-admin')

module.exports = async (req, res, next) => {
    // middleware reads authorization header
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/^Bearer (.+)$/)
    if (!match){
        return res.status(401).json({error: "Missing or malformed Authorization header"}); 
    }
    const idToken = match[1];

    try{
        // Use firebase-admin SDK to verify 
        const decoded = await admin.auth().verifyIdToken(idToken)
        // attach decoded user info to req.user
        req.user = {
            uid: decoded.uid, 
            email: decoded.email, 
            name: decoded.name,
        }; 
        console.log(`Authenticated token for: ${decoded.email}`);
        next(); 
    } catch(err){
        console.error("Auth error", err); 
        res.status(401).json({error: 'Invalid or expired ID token'})
    }
};