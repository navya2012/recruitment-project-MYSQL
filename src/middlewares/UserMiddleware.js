const jwt = require('jsonwebtoken');
const { checkUserIdExist } = require('../models/userModel');


const authUserMiddleware = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        res.status(401).json({ error: "Auth token is required" })
    }

    const token = authorization.split(" ")[1]
    if (!token) {
        return res.status(401).json({ error: "Invalid token format" });
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const user = await checkUserIdExist(decoded.id);
        if (!user) {
            return res.status(401).json({ error: `${decoded.role} ID not found` });
        }

        req.userDetails = user;
        console.log('middleware role,', req.userDetails)
        next();
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
};

//
const roleBasedAuthMiddleware = (expectedRole) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ error: "Auth token is required" });
        }

        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_TOKEN);
            if (!decoded || !decoded.id || !decoded.role) {
                return res.status(401).json({ error: "Invalid token" });
            }

            if (decoded.role !== expectedRole) {
                return res.status(403).json({ error: `Not authorized as ${expectedRole}` });
            }

            const user = await checkUserIdExist(decoded.id);
            if (!user) {
                return res.status(401).json({ error: `${expectedRole} ID not found` });
            }

            req.user = user;
            console.log('middleware role,', req.user)
            next();
        } catch (err) {
            return res.status(401).json({ error: err.message });
        }
    };
};

module.exports = {
    authUserMiddleware,
    roleBasedAuthMiddleware
}
