const {JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next)=>{
    const headerAuth = req.headers.authorization;
    if(!headerAuth || !headerAuth.startsWith("Bearer")){
        return res.status(403).json({message:"header auth missing"});
    }
    const token = headerAuth.split(" ")[1];
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.id = decoded.id;
        next();
    }catch(error){
        return res.status(401).status({message:"Not verified"})
    }

}

module.exports = {
    authMiddleware
}