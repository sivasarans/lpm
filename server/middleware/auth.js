const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
  const headerToken = authHeader && authHeader.split(' ')[1];
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"]|| headerToken;

    if (!token) {
        return res.status(403).json({ 'response': 'Failed', 'message': 'A token is required for authentication' });
    }
    try {
        const decoded = await jwt.verify(token, config.TOKEN_KEY || 'ghstfdt');
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ 'response': 'Failed', 'message': 'Invalid Token' });
    }
    return next();
};

const verifyAdmin = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ 'response': 'Failed', 'message': 'A token is required for authentication' });
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY || 'ghstfdt');
        req.user = decoded;
        if(req.user.role_id != 1) {
            return res.status(401).json({ 'response': 'Failed', 'message': 'Access Denied!' });
        }
    } catch (err) {
        return res.status(401).json({ 'response': 'Failed', 'message': 'Invalid Token' });
    }
    return next();
};

const verifySubAdmin = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ 'response': 'Failed', 'message': 'A token is required for authentication' });

    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY || 'ghstfdt');
        req.user = decoded;
        if(req.user.role_id != 2) {
            return res.status(401).json({ 'response': 'Failed', 'message': 'Access Denied!' });
        }
    } catch (err) {
        return res.status(401).json({ 'response': 'Failed', 'message': 'Invalid Token' });
    }
    return next();
};
const verifyExamLink = async (req,res,next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ 'response': 'Failed', 'message': 'A token is required for authentication' });
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY || 'ghstfdt');
        req.exam = decoded;
        
    } catch (err) {
        return res.status(401).json({ 'response': 'Failed', 'message': 'Invalid or Exam Link is Expired' });
    }
    return next();
}

const authJwt = {
    verifyToken,
    verifyAdmin,
    verifySubAdmin,
    verifyExamLink
};
module.exports = authJwt;