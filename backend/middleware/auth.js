const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const auth = async ( req , res , next ) => {
    const token = req.header("Authorization") && req.header('Authorization').split(' ')[1];

    if (!token) {
        return await res.status(401).json( { "message" : "Token is not provided!"});
    }
    
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }catch ( err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = auth;