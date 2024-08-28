const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

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

        const [rows] = await pool.query('SELECT * FROM userDetails WHERE id = ?', [decoded.id]);

        if (rows.length === 0) {
            return res.status(401).json({ error: `${decoded.role} Id not found` });
        }

        req.userDetails = rows[0];
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Request is not authorized' });
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

            const [rows] = await pool.query('SELECT * FROM userDetails WHERE id = ?', [decoded.id]);
            if (rows.length === 0) {
                return res.status(401).json({ error: `${expectedRole} ID not found` });
            }
            req.user = rows[0];

            next();
        } catch (err) {
            return res.status(401).json({ error: 'Request is not authorized' });
        }
    };
};

module.exports = {
    authUserMiddleware,
    roleBasedAuthMiddleware
}
